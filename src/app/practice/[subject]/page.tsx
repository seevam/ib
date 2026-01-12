import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { users, questions, subjects, userStats } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import QuestionPractice from '@/components/QuestionPractice';

async function getOrCreateUser(clerkId: string, email: string, firstName?: string | null, lastName?: string | null) {
  try {
    let [user] = await db.select().from(users).where(eq(users.clerkId, clerkId));

    if (!user) {
      [user] = await db.insert(users).values({
        clerkId,
        email,
        firstName: firstName || null,
        lastName: lastName || null,
      }).returning();

      await db.insert(userStats).values({
        userId: user.id,
      });
    }

    return user;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

async function getSubjectQuestions(subjectName: string) {
  try {
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
  } catch (error) {
    console.error('Database error:', error);
    return { subject: null, questions: [] };
  }
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

  const clerkUser = await currentUser();
  const user = await getOrCreateUser(
    clerkId,
    clerkUser?.emailAddresses[0]?.emailAddress || '',
    clerkUser?.firstName,
    clerkUser?.lastName
  );

  const { subject } = await params;
  const { subject: subjectData, questions: subjectQuestions } = await getSubjectQuestions(subject);

  // Show error if database is not set up
  if (!user || !subjectData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 max-w-2xl shadow-lg">
          <div className="text-6xl mb-4 text-center">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Database Setup Required</h2>
          <div className="space-y-4 text-gray-700">
            <p>The database tables haven't been created yet. Please follow these steps:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Make sure you've added your <code className="bg-gray-100 px-2 py-1 rounded">DATABASE_URL</code> to <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code></li>
              <li>Run: <code className="bg-gray-100 px-2 py-1 rounded">npm run db:push</code> (creates tables)</li>
              <li>Run: <code className="bg-gray-100 px-2 py-1 rounded">npm run db:seed</code> (adds sample data)</li>
              <li>Restart the dev server: <code className="bg-gray-100 px-2 py-1 rounded">npm run dev</code></li>
            </ol>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="font-semibold text-blue-900 mb-2">📘 Need help?</p>
              <p className="text-blue-800 text-sm">Check the README.md file for detailed setup instructions.</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <a
              href="/dashboard"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
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
