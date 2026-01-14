# IB Learning Platform - Quick Reference

**Quick integration reference for developers. See `INTEGRATION_GUIDE.md` for complete documentation.**

---

## What Is This?

AI-powered educational platform for IB students with:
- 11 subjects (Math, Physics, Chemistry, Biology, English, etc.)
- AI Socratic tutor (GPT-4o)
- Question practice with auto-evaluation
- Progress tracking & gamification

---

## Tech Stack

```bash
Frontend: Next.js 16 + React 19 + Tailwind CSS 4
Backend: Next.js API Routes (serverless)
Database: PostgreSQL (Neon) + Drizzle ORM
Auth: Clerk
AI: OpenAI GPT-4o
```

---

## Quick Setup (5 minutes)

```bash
# 1. Clone
git clone <repo-url>
cd ib-learning-platform

# 2. Install
npm install

# 3. Environment variables (.env.local)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
DATABASE_URL=postgresql://xxx
OPENAI_API_KEY=sk-proj-xxx

# 4. Database
npm run db:push    # Apply schema
npm run db:seed    # Seed data

# 5. Run
npm run dev        # http://localhost:3000
```

---

## API Endpoints

### POST `/api/ai/chat`
AI tutor conversation (Socratic method)

**Request**:
```json
{
  "messages": [{ "role": "user", "content": "Help me" }],
  "question": { "id": 1, "content": "...", ... },
  "userAnswer": "optional"
}
```

**Response**: `{ "response": "..." }`

---

### POST `/api/ai/evaluate`
Evaluate answer + update progress

**Request**:
```json
{
  "question": { ... },
  "userAnswer": "student answer",
  "userId": 123,
  "questionId": 456
}
```

**Response**:
```json
{
  "isCorrect": true,
  "score": 95,
  "feedback": "...",
  "suggestions": ["..."]
}
```

---

### POST `/api/ai/hint`
Generate contextual hint

**Request**:
```json
{
  "question": { ... },
  "conversationHistory": [...]
}
```

**Response**: `{ "hint": "..." }`

---

## Database Schema (Simplified)

```
users
├── id, clerkId, email, firstName, lastName
└── → userStats (1:1)
    └── totalQuestionsAttempted, totalQuestionsCorrect, currentStreak

subjects
└── id, name (enum), displayName, icon

questions
├── id, subjectId, questionType, difficulty
├── title, content, options (JSONB)
└── correctAnswer, explanation

userProgress
├── id, userId, questionId, subjectId
├── attempts, correctAttempts, score
└── lastAttemptedAt, isCompleted, userAnswer
```

---

## Core Components

**Server Components** (fetch data):
- `/src/app/page.tsx` - Landing page
- `/src/app/dashboard/page.tsx` - Dashboard
- `/src/app/practice/[subject]/page.tsx` - Practice wrapper

**Client Components** (interactive):
- `/src/components/QuestionPractice.tsx` - Main practice UI

---

## Integration Options

### Option 1: Full App (Easiest)
Mount entire app under `/ib-learning` route
- ✅ Zero modification
- ❌ Need to sync auth & database

### Option 2: Components
Extract `QuestionPractice` + AI logic
- ✅ Flexible
- ❌ Requires refactoring

### Option 3: API Only
Use AI endpoints, build custom UI
- ✅ Full control
- ❌ Rebuild entire frontend

### Option 4: Database Merge
Integrate schemas into existing DB
- ✅ Single database
- ❌ Complex migration

---

## Key Files

```
/src
├── app/
│   ├── api/ai/             # AI endpoints
│   ├── dashboard/          # Dashboard page
│   └── practice/[subject]/ # Practice page
├── components/
│   └── QuestionPractice.tsx # Main UI component
├── lib/
│   ├── ai/
│   │   ├── client.ts       # OpenAI client
│   │   └── tutor.ts        # AI logic
│   └── db/
│       ├── index.ts        # DB connection
│       ├── schema.ts       # Drizzle schema
│       └── seed.ts         # Seed script
└── middleware.ts           # Auth middleware
```

---

## Authentication Flow

1. User visits protected route → Middleware checks session
2. No session → Redirect to `/sign-in` (Clerk)
3. Has session → Create user in DB (if new)
4. API calls → Extract `userId` from Clerk session

```typescript
// In API routes
const { userId } = await auth();
if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });
```

---

## Adding a New Subject

```typescript
// 1. Add to enum in schema.ts
export const subjectEnum = pgEnum('subject', [
  // ... existing
  'new_subject'
]);

// 2. Generate migration
npm run db:generate && npm run db:push

// 3. Seed subject
await db.insert(subjects).values({
  name: 'new_subject',
  displayName: 'New Subject',
  icon: '📚'
});

// 4. Add questions
await db.insert(questions).values({
  subjectId: newSubjectId,
  questionType: 'multiple_choice',
  difficulty: 'medium',
  // ...
});
```

---

## Adding a New Question Type

```typescript
// 1. Add to enum
export const questionTypeEnum = pgEnum('question_type', [
  'multiple_choice',
  'short_answer',
  'essay',
  'calculation',
  'true_false' // NEW
]);

// 2. Update QuestionPractice component
function renderAnswerInput() {
  if (question.questionType === 'true_false') {
    return (
      <div>
        <input type="radio" value="true" />
        <input type="radio" value="false" />
      </div>
    );
  }
  // ... existing types
}

// 3. Update AI evaluation logic
// AI automatically handles new types, but you can add specific prompts
```

---

## Common Queries

### Get user statistics
```typescript
const [stats] = await db.select()
  .from(userStats)
  .where(eq(userStats.userId, userId));

const accuracy = (stats.totalQuestionsCorrect / stats.totalQuestionsAttempted) * 100;
```

### Get user progress by subject
```typescript
const progress = await db.select()
  .from(userProgress)
  .where(
    and(
      eq(userProgress.userId, userId),
      eq(userProgress.subjectId, subjectId)
    )
  );
```

### Get questions by subject and difficulty
```typescript
const questions = await db.select()
  .from(questionsTable)
  .where(
    and(
      eq(questionsTable.subjectId, subjectId),
      eq(questionsTable.difficulty, 'medium')
    )
  )
  .limit(20);
```

---

## Environment Variables

```bash
# Clerk (https://clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Neon PostgreSQL (https://neon.tech)
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# OpenAI (https://platform.openai.com)
OPENAI_API_KEY=sk-proj-...
```

---

## Database Commands

```bash
npm run db:generate    # Generate migrations
npm run db:push        # Apply schema changes
npm run db:seed        # Seed sample data
npm run db:studio      # Open GUI (localhost:4983)
```

---

## Deployment (Vercel)

```bash
# 1. Push to GitHub
git push origin main

# 2. Import to Vercel
# vercel.com → New Project → Import repo

# 3. Add environment variables in Vercel dashboard

# 4. Deploy
# Automatic on git push
```

---

## Security Checklist

- [ ] Remove `.env.local` from Git
- [ ] Add rate limiting to API endpoints
- [ ] Enable Clerk 2FA
- [ ] Add request validation (Zod)
- [ ] Enable database backups
- [ ] Use HTTPS (production)
- [ ] Rotate API keys regularly
- [ ] Implement session timeout
- [ ] Add CSP headers
- [ ] Monitor for suspicious activity

---

## Performance Tips

```typescript
// 1. Cache static data
const subjects = unstable_cache(
  async () => db.select().from(subjectsTable),
  ['subjects'],
  { revalidate: 3600 }
);

// 2. Limit conversation history
const recentMessages = messages.slice(-10);

// 3. Use prepared statements
const getQuestions = db
  .select()
  .from(questionsTable)
  .where(eq(questionsTable.subjectId, sql.placeholder('subjectId')))
  .prepare('get_questions');

// 4. Add database indexes
CREATE INDEX idx_user_progress_user_subject ON user_progress(user_id, subject_id);

// 5. Enable connection pooling
import { Pool } from '@neondatabase/serverless';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
```

---

## Troubleshooting

**Database connection error**:
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

**Clerk auth not working**:
```bash
# Verify env vars
echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# Restart dev server
npm run dev
```

**OpenAI 429 error**:
- Rate limit exceeded → Reduce request frequency
- Implement exponential backoff

**Build fails**:
```bash
# Clean cache
rm -rf .next
npm run build
```

---

## Code Examples

### Fetch user with stats
```typescript
import { auth, currentUser } from '@clerk/nextjs/server';

const { userId: clerkId } = await auth();
const clerkUser = await currentUser();

const [user] = await db.select()
  .from(users)
  .where(eq(users.clerkId, clerkId));

const [stats] = await db.select()
  .from(userStats)
  .where(eq(userStats.userId, user.id));
```

### Submit answer
```typescript
const response = await fetch('/api/ai/evaluate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    question: currentQuestion,
    userAnswer: answer,
    userId: user.id,
    questionId: currentQuestion.id
  })
});

const evaluation = await response.json();
console.log(`Score: ${evaluation.score}/100`);
```

### AI chat interaction
```typescript
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  body: JSON.stringify({
    messages: chatHistory,
    question: currentQuestion,
    userAnswer: currentAnswer
  })
});

const { response: aiMessage } = await response.json();
setChatMessages([...chatHistory, {
  role: 'assistant',
  content: aiMessage
}]);
```

---

## Customization

### Change AI behavior
Edit `/src/lib/ai/tutor.ts`:
```typescript
const systemPrompt = `
  You are an AI tutor...
  [Modify teaching style here]
`;
```

### Adjust scoring
Edit evaluation logic:
```typescript
// Current: 0-100 scale
// Change to: Pass/Fail
return {
  isCorrect: score >= 70,
  grade: score >= 70 ? 'Pass' : 'Fail',
  score
};
```

### Add custom metrics
```typescript
// Add to userStats table
ALTER TABLE user_stats ADD COLUMN custom_metric INTEGER DEFAULT 0;

// Update in Drizzle schema
export const userStats = pgTable('user_stats', {
  // ... existing
  customMetric: integer('custom_metric').default(0)
});
```

---

## Resources

- **Full Guide**: `INTEGRATION_GUIDE.md`
- **Next.js**: https://nextjs.org/docs
- **Drizzle ORM**: https://orm.drizzle.team
- **Clerk**: https://clerk.com/docs
- **OpenAI**: https://platform.openai.com/docs

---

## Support

- GitHub Issues: [repo]/issues
- Email: dev@yourdomain.com
- Docs: docs.yourdomain.com

---

**Last Updated**: January 2026
**See**: `INTEGRATION_GUIDE.md` for complete documentation
