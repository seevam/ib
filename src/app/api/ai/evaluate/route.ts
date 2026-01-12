import { NextRequest, NextResponse } from 'next/server';
import { evaluateAnswer, Question } from '@/lib/ai/tutor';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users, userProgress, userStats } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { question, userAnswer, userId, questionId } = await request.json();

    const evaluation = await evaluateAnswer(question as Question, userAnswer);

    // Update user progress
    const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId));

    if (user) {
      // Check if progress exists
      const [existingProgress] = await db
        .select()
        .from(userProgress)
        .where(eq(userProgress.questionId, questionId))
        .where(eq(userProgress.userId, user.id));

      if (existingProgress) {
        // Update existing progress
        await db
          .update(userProgress)
          .set({
            attempts: existingProgress.attempts + 1,
            correctAttempts: evaluation.isCorrect
              ? existingProgress.correctAttempts + 1
              : existingProgress.correctAttempts,
            lastAttemptedAt: new Date(),
            isCompleted: evaluation.isCorrect,
            userAnswer,
            score: evaluation.score,
            updatedAt: new Date(),
          })
          .where(eq(userProgress.id, existingProgress.id));
      } else {
        // Insert new progress (need to get subjectId from question)
        // For now, we'll skip this as we need to query the question's subject
      }

      // Update user stats
      const [stats] = await db.select().from(userStats).where(eq(userStats.userId, user.id));

      if (stats) {
        await db
          .update(userStats)
          .set({
            totalQuestionsAttempted: stats.totalQuestionsAttempted + 1,
            totalQuestionsCorrect: evaluation.isCorrect
              ? stats.totalQuestionsCorrect + 1
              : stats.totalQuestionsCorrect,
            lastActivityDate: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(userStats.userId, user.id));
      }
    }

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error('Evaluation error:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate answer' },
      { status: 500 }
    );
  }
}
