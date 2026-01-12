import { NextRequest, NextResponse } from 'next/server';
import { getAITutorResponse, Message, Question } from '@/lib/ai/tutor';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages, question, userAnswer } = await request.json();

    const response = await getAITutorResponse(
      messages as Message[],
      question as Question,
      userAnswer
    );

    return NextResponse.json({ response });
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
}
