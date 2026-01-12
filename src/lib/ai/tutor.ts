import { openai } from './client';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface Question {
  title: string;
  content: string;
  correctAnswer: string;
  explanation: string;
  subject: string;
  difficulty: string;
}

const SYSTEM_PROMPT = `You are an expert IB (International Baccalaureate) tutor with a Socratic teaching approach. Your goal is to help students develop deep understanding and cognitive reasoning skills, not just provide answers.

Core Principles:
1. **Build Cognitive Logic**: Guide students through the thinking process rather than giving direct answers
2. **Socratic Method**: Ask probing questions that lead students to discover answers themselves
3. **Conceptual Understanding**: Focus on "why" and "how" rather than just "what"
4. **Scaffolded Learning**: Break complex problems into manageable steps
5. **Positive Reinforcement**: Encourage effort and progress, not just correct answers
6. **Metacognition**: Help students reflect on their own thinking process

Teaching Strategies:
- When a student asks for help, first understand what they've tried
- Ask guiding questions like: "What do you know so far?", "What patterns do you notice?", "How might this relate to concepts you've learned?"
- If they're stuck, provide hints that illuminate the path without revealing the answer
- When they make progress, acknowledge it and build on their reasoning
- If they make mistakes, guide them to discover the error themselves
- Connect concepts to real-world applications when relevant
- Adapt your language to the student's level of understanding

Remember: Your role is to develop independent thinkers, not dependent learners. Every interaction should strengthen their problem-solving abilities.`;

export async function getAITutorResponse(
  messages: Message[],
  question: Question,
  userAnswer?: string
): Promise<string> {
  const contextMessages: Message[] = [
    {
      role: 'system',
      content: SYSTEM_PROMPT,
    },
    {
      role: 'system',
      content: `Current Question Context:
Subject: ${question.subject}
Difficulty: ${question.difficulty}
Question: ${question.content}
${userAnswer ? `Student's Current Answer: ${userAnswer}` : ''}

Note: You have access to the correct answer (${question.correctAnswer}) and explanation, but use this knowledge to guide, not to simply reveal.`,
    },
    ...messages,
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: contextMessages,
    temperature: 0.7,
    max_tokens: 500,
  });

  return completion.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.';
}

export async function evaluateAnswer(
  question: Question,
  userAnswer: string
): Promise<{
  isCorrect: boolean;
  score: number;
  feedback: string;
  suggestions: string[];
}> {
  const evaluationPrompt = `You are evaluating a student's answer to an IB question.

Question: ${question.content}
Correct Answer: ${question.correctAnswer}
Student's Answer: ${userAnswer}
Explanation: ${question.explanation}

Evaluate the student's answer and provide:
1. Whether it's correct (fully correct, partially correct, or incorrect)
2. A score from 0-100
3. Constructive feedback that highlights what they did well and what needs improvement
4. Specific suggestions for improvement

Format your response as JSON:
{
  "isCorrect": boolean,
  "score": number,
  "feedback": "detailed feedback string",
  "suggestions": ["suggestion 1", "suggestion 2"]
}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are an expert IB examiner. Provide fair, constructive evaluations.',
      },
      {
        role: 'user',
        content: evaluationPrompt,
      },
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  });

  const result = JSON.parse(completion.choices[0]?.message?.content || '{}');

  return {
    isCorrect: result.isCorrect || false,
    score: result.score || 0,
    feedback: result.feedback || 'Unable to evaluate at this time.',
    suggestions: result.suggestions || [],
  };
}

export async function generateHint(question: Question, conversationHistory: Message[]): Promise<string> {
  const hintPrompt = `Based on the conversation history, generate a helpful hint that guides the student toward the solution without revealing the answer directly. The hint should:
1. Build on what they already understand
2. Ask a guiding question or provide a small piece of information
3. Encourage them to think through the next step

Question: ${question.content}
Correct Answer Context: ${question.correctAnswer}`;

  const messages: Message[] = [
    {
      role: 'system',
      content: SYSTEM_PROMPT,
    },
    ...conversationHistory,
    {
      role: 'user',
      content: hintPrompt,
    },
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    temperature: 0.7,
    max_tokens: 200,
  });

  return completion.choices[0]?.message?.content || 'Think about the key concepts involved in this problem.';
}
