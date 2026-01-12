import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { users, questions, subjects } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import QuestionPractice from '@/components/QuestionPractice';

async function getUser(clerkId: string) {
  const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId));
  return user;
}

async function getSubjectQuestions(subjectName: string) {
  const [subject] = await db.select().from(subjects).where(eq(subjects.name, subjectName as any));

  if (!subject) {
    return { subject: null, questions: [] };
  }

  const subjectQuestions = await db
    .select()
    .from(questions)
    .where(eq(questions.subjectId, subject.id))
    .limit(20);

  return { subject, questions: subjectQuestions };
}

export default async function PracticePage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    redirect('/sign-in');
  }

  const user = await getUser(clerkId);

  if (!user) {
    redirect('/dashboard');
  }

  const { subject } = await params;
  const { subject: subjectData, questions: subjectQuestions } = await getSubjectQuestions(subject);

  if (!subjectData) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </a>
          <div className="font-semibold text-gray-900">{subjectData.displayName}</div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {subjectQuestions.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No questions available yet</h2>
            <p className="text-gray-600 mb-6">
              Questions for {subjectData.displayName} are being prepared. Please check back soon!
            </p>
            <a
              href="/dashboard"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Back to Dashboard
            </a>
          </div>
        ) : (
          <QuestionPractice
            questions={subjectQuestions}
            subject={subjectData}
            userId={user.id}
          />
        )}
      </main>
    </div>
  );
}
