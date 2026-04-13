import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'
import OpenAI from 'openai'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder',
})

interface GenerateRequest {
  subjectId: string
  subjectName: string
  level: string // 'SL' | 'HL'
  topicId: string
  count: number
  jobId: string
  userId: string
}

interface GeneratedQuestion {
  topic_id: string
  subject_id: string
  question_text: string
  question_type: string
  marks: number
  difficulty: string
  model_answer: string
  marking_criteria: string[]
  examiner_notes: string
}

// GET — poll job status or list questions for a topic
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth()

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const jobId = searchParams.get('jobId')
    const topicId = searchParams.get('topicId')

    if (jobId) {
      const { data: job, error } = await supabase
        .from('generation_jobs')
        .select('*')
        .eq('id', jobId)
        .single()

      if (error) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 })
      }

      return NextResponse.json({ job })
    }

    if (topicId) {
      const { data: questions } = await supabase
        .from('questions')
        .select('*')
        .eq('topic_id', topicId)
        .order('created_at', { ascending: false })

      return NextResponse.json({ questions: questions ?? [] })
    }

    return NextResponse.json(
      { error: 'jobId or topicId query param is required' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}

// POST — queue a new AI question generation job
export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth()

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { subjectId, subjectName, level, topicId, count = 5, jobId } = body

    if (!subjectId || !topicId || !jobId) {
      return NextResponse.json(
        { error: 'subjectId, topicId, and jobId are required' },
        { status: 400 }
      )
    }

    // Persist job record so the client can poll for progress
    await supabase.from('generation_jobs').upsert({
      id: jobId,
      topic_id: topicId,
      subject_id: subjectId,
      user_id: clerkId,
      status: 'queued',
      requested_count: Math.min(count, 10),
      created_at: new Date().toISOString(),
    })

    // Fire-and-forget: do not await so the HTTP response returns immediately
    generateQuestionsAsync({
      subjectId,
      subjectName: subjectName ?? 'Chemistry',
      level: level ?? 'SL',
      topicId,
      count: Math.min(count, 10),
      jobId,
      userId: clerkId,
    })

    return NextResponse.json({ status: 'queued', jobId })
  } catch (error) {
    console.error('Question generation start error:', error)
    return NextResponse.json(
      { error: 'Failed to start question generation' },
      { status: 500 }
    )
  }
}

async function generateQuestionsAsync({
  subjectId,
  subjectName,
  level,
  topicId,
  count,
  jobId,
  userId,
}: GenerateRequest) {
  try {
    // Mark job as processing
    await supabase
      .from('generation_jobs')
      .update({ status: 'processing', started_at: new Date().toISOString() })
      .eq('id', jobId)

    // Fetch up to 3 existing questions from this topic as style examples
    const { data: sampleQuestions } = await supabase
      .from('questions')
      .select('question_text, question_type, marks, model_answer, marking_criteria')
      .eq('topic_id', topicId)
      .order('created_at', { ascending: false })
      .limit(3)

    let examplesContext = ''
    if (sampleQuestions && sampleQuestions.length > 0) {
      examplesContext = '\nEXAMPLE QUESTIONS FROM THIS TOPIC (match this IB exam style and format):\n'
      sampleQuestions.forEach((q, i) => {
        examplesContext += `\nExample ${i + 1} [${q.question_type}, ${q.marks} mark${q.marks !== 1 ? 's' : ''}]:\n`
        examplesContext += `Q: ${q.question_text}\n`
        examplesContext += `A: ${q.model_answer}\n`
        if (q.marking_criteria?.length) {
          examplesContext += `Mark scheme: ${q.marking_criteria.join(' / ')}\n`
        }
      })
    }

    // Fetch topic details including IB syllabus assessable statements
    const { data: topic } = await supabase
      .from('topics')
      .select('name, sub_topic, common_weaknesses, difficulty_level, weightage, syllabus_points')
      .eq('id', topicId)
      .single()

    if (!topic) {
      throw new Error(`Topic ${topicId} not found`)
    }

    const topicContext = [
      `TOPIC: ${topic.sub_topic} — ${topic.name}`,
      `IB Level: ${level}`,
      `Difficulty: ${topic.difficulty_level ?? 'medium'}`,
      `Exam weighting: ${topic.weightage ?? 5}%`,
      topic.common_weaknesses?.length
        ? `Common student weaknesses:\n${topic.common_weaknesses.map((w: string) => `  • ${w}`).join('\n')}`
        : '',
    ]
      .filter(Boolean)
      .join('\n')

    let syllabusBlock = ''
    if (topic.syllabus_points?.length) {
      syllabusBlock = `\nIB SYLLABUS ASSESSABLE STATEMENTS FOR THIS TOPIC (STRICT — only test these):\n${topic.syllabus_points.map((p: string) => `  • ${p}`).join('\n')}`
    }

    const systemPrompt = `You are an expert IB ${subjectName} ${level} examiner and question writer with 15+ years of experience setting and marking IB exams.

Your task is to generate ${count} high-quality, exam-ready IB ${subjectName} ${level} questions for the topic below.

${topicContext}
${syllabusBlock}
${examplesContext}

STRICT RULES:
1. ONLY test concepts listed in the IB SYLLABUS ASSESSABLE STATEMENTS above — do not go beyond them
2. Every question must be answerable using knowledge from the IB ${subjectName} ${level} course only
3. Questions must match IB style: precise scientific language, appropriate command terms (state, explain, calculate, deduce, etc.)
4. Include a mix of question types: short_answer (1–2 marks), structured (3–4 marks), data_response (5–6 marks)
5. Provide a complete model answer and a mark scheme for every question
6. Do NOT repeat questions already shown in the examples above
7. Return ONLY valid JSON — no markdown, no prose outside the JSON structure

REQUIRED JSON FORMAT:
{
  "questions": [
    {
      "question_text": "Full question text here",
      "question_type": "short_answer | structured | data_response",
      "marks": 2,
      "difficulty": "easy | medium | hard",
      "model_answer": "Complete model answer",
      "marking_criteria": ["award 1 mark for ...", "award 1 mark for ..."],
      "examiner_notes": "Notes on common errors or marking guidance"
    }
  ]
}`

    const userPrompt = `Generate exactly ${count} IB ${subjectName} ${level} questions for the topic "${topic.sub_topic} — ${topic.name}". Follow the system instructions precisely and return only the JSON object.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.6,
      response_format: { type: 'json_object' },
    })

    const raw = completion.choices[0]?.message?.content ?? '{}'
    let parsed: { questions?: GeneratedQuestion[] }

    try {
      parsed = JSON.parse(raw)
    } catch {
      throw new Error(`AI returned invalid JSON: ${raw.slice(0, 200)}`)
    }

    const generated = parsed.questions ?? []

    if (generated.length === 0) {
      throw new Error('AI returned an empty questions array')
    }

    // Persist generated questions
    const rows = generated.map((q) => ({
      topic_id: topicId,
      subject_id: subjectId,
      question_text: q.question_text,
      question_type: q.question_type,
      marks: q.marks,
      difficulty: q.difficulty,
      model_answer: q.model_answer,
      marking_criteria: q.marking_criteria,
      examiner_notes: q.examiner_notes,
      generated_by: userId,
      created_at: new Date().toISOString(),
    }))

    const { error: insertError } = await supabase.from('questions').insert(rows)

    if (insertError) {
      throw new Error(`Failed to insert questions: ${insertError.message}`)
    }

    // Mark job as completed
    await supabase
      .from('generation_jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        generated_count: generated.length,
      })
      .eq('id', jobId)
  } catch (error) {
    console.error('generateQuestionsAsync failed:', error)

    await supabase
      .from('generation_jobs')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        completed_at: new Date().toISOString(),
      })
      .eq('id', jobId)
  }
}
