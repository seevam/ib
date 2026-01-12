import { NextRequest, NextResponse } from 'next/server';
import { generateHint, Message, Question } from '@/lib/ai/tutor';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { question, conversationHistory } = await request.json();

    const hint = await generateHint(
      question as Question,
      conversationHistory as Message[]
    );

    return NextResponse.json({ hint });
  } catch (error) {
    console.error('Hint generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate hint' },
      { status: 500 }
    );
  }
}
