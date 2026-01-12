import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { users, userStats, subjects } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const SUBJECT_DATA = [
  { name: 'mathematics', displayName: 'Mathematics', icon: '🔢', color: 'bg-blue-100 text-blue-700' },
  { name: 'physics', displayName: 'Physics', icon: '⚛️', color: 'bg-purple-100 text-purple-700' },
  { name: 'chemistry', displayName: 'Chemistry', icon: '🧪', color: 'bg-green-100 text-green-700' },
  { name: 'biology', displayName: 'Biology', icon: '🧬', color: 'bg-teal-100 text-teal-700' },
  { name: 'english', displayName: 'English', icon: '📚', color: 'bg-red-100 text-red-700' },
  { name: 'history', displayName: 'History', icon: '🏛️', color: 'bg-amber-100 text-amber-700' },
  { name: 'geography', displayName: 'Geography', icon: '🌍', color: 'bg-emerald-100 text-emerald-700' },
  { name: 'economics', displayName: 'Economics', icon: '💹', color: 'bg-indigo-100 text-indigo-700' },
  { name: 'business_management', displayName: 'Business Management', icon: '💼', color: 'bg-cyan-100 text-cyan-700' },
  { name: 'psychology', displayName: 'Psychology', icon: '🧠', color: 'bg-pink-100 text-pink-700' },
  { name: 'computer_science', displayName: 'Computer Science', icon: '💻', color: 'bg-slate-100 text-slate-700' },
];

async function getOrCreateUser(clerkId: string, email: string, firstName?: string | null, lastName?: string | null) {
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
}

async function getUserStats(userId: number) {
  const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId));
  return stats;
}

export default async function DashboardPage() {
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

  const stats = await getUserStats(user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              IB
            </div>
            <span className="text-xl font-bold text-gray-900">Learning Platform</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {clerkUser?.firstName || 'Student'}!
          </h1>
          <p className="text-gray-600">Choose a subject to start practicing</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Questions Attempted</div>
            <div className="text-3xl font-bold text-gray-900">{stats?.totalQuestionsAttempted || 0}</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Correct Answers</div>
            <div className="text-3xl font-bold text-green-600">{stats?.totalQuestionsCorrect || 0}</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Current Streak</div>
            <div className="text-3xl font-bold text-orange-600">{stats?.currentStreak || 0} days</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Accuracy</div>
            <div className="text-3xl font-bold text-blue-600">
              {stats?.totalQuestionsAttempted
                ? Math.round((stats.totalQuestionsCorrect / stats.totalQuestionsAttempted) * 100)
                : 0}%
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Subject</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SUBJECT_DATA.map((subject) => (
              <Link
                key={subject.name}
                href={`/practice/${subject.name}`}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all hover:scale-105 group"
              >
                <div className={`w-16 h-16 ${subject.color} rounded-lg flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                  {subject.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{subject.displayName}</h3>
                <p className="text-gray-600 text-sm">Start practicing questions</p>
                <div className="mt-4 flex items-center text-blue-600 font-medium">
                  <span>Start Practice</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
