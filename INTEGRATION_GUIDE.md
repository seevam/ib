# IB Learning Platform - Integration Guide

**Version:** 1.0
**Last Updated:** January 2026
**Status:** Production Ready

---

## Table of Contents

1. [Product Overview](#product-overview)
2. [Technical Architecture](#technical-architecture)
3. [Integration Options](#integration-options)
4. [Tech Stack & Dependencies](#tech-stack--dependencies)
5. [Database Schema](#database-schema)
6. [API Reference](#api-reference)
7. [Authentication & Authorization](#authentication--authorization)
8. [AI Components](#ai-components)
9. [Frontend Components](#frontend-components)
10. [Setup & Configuration](#setup--configuration)
11. [Code Examples](#code-examples)
12. [Deployment Guide](#deployment-guide)
13. [Security Considerations](#security-considerations)
14. [Performance & Scalability](#performance--scalability)
15. [Troubleshooting](#troubleshooting)

---

## Product Overview

### What is IB Learning Platform?

An AI-powered educational web application designed specifically for International Baccalaureate (IB) students that provides:

- **Interactive Question Practice** across 11 IB subjects
- **AI-Powered Cognitive Tutor** using Socratic teaching methodology
- **Real-time Progress Tracking** with statistics and streak management
- **Personalized Learning Experience** with adaptive AI responses

### Core Value Propositions

1. **Socratic Learning Method**: AI guides students to answers through questions rather than direct instruction
2. **Comprehensive IB Coverage**: All major IB subjects with proper question taxonomy
3. **Intelligent Evaluation**: AI-powered answer assessment with detailed feedback
4. **Gamification**: Streaks, scores, and progress tracking to maintain engagement
5. **Contextual Assistance**: Smart hints based on conversation history

### Supported Subjects (11 Total)

- Mathematics
- Physics
- Chemistry
- Biology
- English
- History
- Geography
- Economics
- Business Management
- Psychology
- Computer Science

### Key Features

| Feature | Description |
|---------|-------------|
| Question Types | Multiple choice, Short answer, Essay, Calculation |
| Difficulty Levels | Easy, Medium, Hard |
| AI Tutor | Real-time chat with GPT-4o |
| Hint System | Context-aware hints based on conversation |
| Answer Evaluation | AI-powered scoring (0-100) with detailed feedback |
| Progress Tracking | Attempts, accuracy, streaks, study time |
| User Management | Secure authentication via Clerk |

---

## Technical Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│  Next.js 16 App Router + React 19 + Tailwind CSS           │
│  - Landing Page                                             │
│  - Dashboard (Subject Selection)                            │
│  - Practice Interface (Question + AI Chat)                  │
│  - Authentication UI (Clerk)                                │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ API Routes (Serverless)
                        │
┌───────────────────────┴─────────────────────────────────────┐
│                      Application Layer                       │
│  Next.js API Routes (TypeScript)                            │
│  - /api/ai/chat       - AI tutor conversations              │
│  - /api/ai/evaluate   - Answer evaluation                   │
│  - /api/ai/hint       - Contextual hints                    │
└────────────┬──────────────────────────┬─────────────────────┘
             │                          │
             │                          │
┌────────────┴──────────┐    ┌──────────┴─────────────┐
│   External Services   │    │    Data Layer          │
│                       │    │                        │
│  - Clerk Auth         │    │  PostgreSQL (Neon)     │
│  - OpenAI GPT-4o      │    │  Drizzle ORM           │
│                       │    │  - users               │
│                       │    │  - questions           │
│                       │    │  - userProgress        │
│                       │    │  - userStats           │
│                       │    │  - aiConversations     │
└───────────────────────┘    └────────────────────────┘
```

### Application Flow

1. **User Authentication**: Clerk handles sign-in/sign-up → Creates user in database
2. **Dashboard**: Displays subjects + user statistics
3. **Practice Session**:
   - Loads questions for selected subject
   - Displays question with answer input
   - AI chat panel for assistance
   - Submit answer → AI evaluation → Update progress
4. **AI Interaction**:
   - Chat endpoint: Socratic guidance
   - Hint endpoint: Context-aware hints
   - Evaluate endpoint: Answer scoring + feedback

### Technology Decisions

| Technology | Reason |
|------------|--------|
| Next.js 16 | Server components, API routes, optimized builds |
| React 19 | Latest features, improved performance |
| TypeScript | Type safety, better DX |
| Tailwind CSS | Rapid UI development, consistent styling |
| Clerk | Production-ready auth, easy integration |
| Neon PostgreSQL | Serverless, auto-scaling, excellent DX |
| Drizzle ORM | Type-safe, lightweight, great TypeScript support |
| OpenAI GPT-4o | Best-in-class AI for educational contexts |

---

## Integration Options

### Option 1: Full Application Integration (Recommended)

**Use Case**: Embed entire IB Learning Platform as a module within another educational platform

**Approach**:
- Mount as a sub-application under a route (e.g., `/ib-learning`)
- Share authentication context
- Integrate database schemas
- Optionally rebrand UI components

**Pros**:
- ✅ Complete feature set
- ✅ Minimal modification needed
- ✅ Proven architecture

**Cons**:
- ❌ Requires database migration
- ❌ Need to handle auth sync

---

### Option 2: Component Library Integration

**Use Case**: Use specific components (question practice, AI tutor) in existing application

**Approach**:
- Extract core components: `QuestionPractice`, AI tutor logic
- Create wrapper components
- Integrate API endpoints
- Adapt to existing design system

**Pros**:
- ✅ Flexible integration
- ✅ Can reuse existing infrastructure
- ✅ Gradual adoption

**Cons**:
- ❌ Requires significant refactoring
- ❌ Need to rebuild certain features

---

### Option 3: API-Only Integration

**Use Case**: Use AI tutoring capabilities in a completely different application

**Approach**:
- Expose AI endpoints as standalone API
- Implement API authentication
- Connect to existing question database
- Build custom frontend

**Pros**:
- ✅ Maximum flexibility
- ✅ Technology-agnostic frontend
- ✅ Microservices architecture

**Cons**:
- ❌ Lose frontend components
- ❌ Need to rebuild entire UI
- ❌ More complex deployment

---

### Option 4: Database Schema Integration

**Use Case**: Add IB learning features to existing educational platform with similar data model

**Approach**:
- Merge database schemas
- Map existing users/questions to IB schema
- Integrate AI logic into existing APIs
- Build UI using existing component library

**Pros**:
- ✅ Single database
- ✅ Unified data model
- ✅ Consistent UX

**Cons**:
- ❌ Complex migration
- ❌ Risk of data conflicts
- ❌ Significant testing required

---

## Tech Stack & Dependencies

### Core Framework

```json
{
  "next": "^16.0.1",
  "react": "^19.2.3",
  "react-dom": "^19.2.3",
  "typescript": "^5"
}
```

### Database & ORM

```json
{
  "drizzle-orm": "^0.45.1",
  "@neondatabase/serverless": "^1.0.2",
  "drizzle-kit": "^0.31.8"
}
```

### Authentication

```json
{
  "@clerk/nextjs": "^6.36.7"
}
```

### AI/ML

```json
{
  "openai": "^6.16.0"
}
```

### Styling

```json
{
  "tailwindcss": "^4.0.0",
  "postcss": "^9.0.0"
}
```

### Validation

```json
{
  "zod": "^4.3.5"
}
```

### Installation

```bash
npm install next@^16.0.1 react@^19.2.3 react-dom@^19.2.3
npm install drizzle-orm@^0.45.1 @neondatabase/serverless@^1.0.2
npm install @clerk/nextjs@^6.36.7
npm install openai@^6.16.0
npm install tailwindcss@^4.0.0
npm install zod@^4.3.5
npm install -D typescript@^5 drizzle-kit@^0.31.8
```

---

## Database Schema

### Entity Relationship Diagram

```
users (1) ──────── (1) userStats
  │
  │ (1)
  │
  ├──────────── (n) userProgress ────── (1) questions
  │                                          │
  │ (1)                                      │
  │                                          │ (n)
  ├──────────── (n) aiConversations ────────┤
  │                                          │
  │ (n)                                      │ (1)
  │                                          │
  └──────────── (n) userSubjects ───────────┤
                                             │
                                        subjects
```

### Core Tables

#### 1. `users` Table

Stores user account information synchronized with Clerk.

```typescript
{
  id: serial PRIMARY KEY,
  clerkId: text UNIQUE NOT NULL,        // Clerk user identifier
  email: text NOT NULL,
  firstName: text,
  lastName: text,
  createdAt: timestamp DEFAULT now(),
  updatedAt: timestamp DEFAULT now()
}
```

**Indexes**:
- `clerkId` (unique)

**Purpose**: Central user registry, links Clerk auth to application data

---

#### 2. `subjects` Table

Defines IB subjects available in the platform.

```typescript
{
  id: serial PRIMARY KEY,
  name: subjectEnum UNIQUE NOT NULL,    // 'mathematics', 'physics', etc.
  displayName: text NOT NULL,           // 'Mathematics', 'Physics', etc.
  description: text,
  icon: text,                           // Emoji or icon identifier
  createdAt: timestamp DEFAULT now()
}
```

**Enums**:
```typescript
subjectEnum:
  'mathematics' | 'physics' | 'chemistry' | 'biology' |
  'english' | 'history' | 'geography' | 'economics' |
  'business_management' | 'psychology' | 'computer_science'
```

**Purpose**: Subject catalog for question categorization

---

#### 3. `questions` Table

Question bank with metadata and answers.

```typescript
{
  id: serial PRIMARY KEY,
  subjectId: integer NOT NULL,          // FK to subjects
  questionType: questionTypeEnum NOT NULL,
  difficulty: difficultyEnum NOT NULL,
  title: text NOT NULL,
  content: text NOT NULL,               // Question text
  options: jsonb,                       // { "A": "...", "B": "...", "C": "...", "D": "..." }
  correctAnswer: text NOT NULL,
  explanation: text NOT NULL,
  tags: text[],                         // ['algebra', 'equations']
  learningObjectives: text[],           // ['Solve linear equations']
  markingCriteria: jsonb,               // Structured scoring rubric
  createdAt: timestamp DEFAULT now(),
  updatedAt: timestamp DEFAULT now()
}
```

**Enums**:
```typescript
questionTypeEnum: 'multiple_choice' | 'short_answer' | 'essay' | 'calculation'
difficultyEnum: 'easy' | 'medium' | 'hard'
```

**Foreign Keys**:
- `subjectId` → `subjects.id`

**Purpose**: Core content repository

---

#### 4. `userProgress` Table

Tracks individual question attempts and performance.

```typescript
{
  id: serial PRIMARY KEY,
  userId: integer NOT NULL,             // FK to users
  questionId: integer NOT NULL,         // FK to questions
  subjectId: integer NOT NULL,          // FK to subjects
  attempts: integer DEFAULT 0,
  correctAttempts: integer DEFAULT 0,
  lastAttemptedAt: timestamp,
  isCompleted: boolean DEFAULT false,
  userAnswer: text,                     // Last submitted answer
  score: integer,                       // 0-100
  createdAt: timestamp DEFAULT now(),
  updatedAt: timestamp DEFAULT now()
}
```

**Foreign Keys**:
- `userId` → `users.id`
- `questionId` → `questions.id`
- `subjectId` → `subjects.id`

**Purpose**: Per-question tracking for adaptive learning

---

#### 5. `userStats` Table

Aggregated user statistics and gamification metrics.

```typescript
{
  id: serial PRIMARY KEY,
  userId: integer UNIQUE NOT NULL,      // FK to users (one-to-one)
  totalQuestionsAttempted: integer DEFAULT 0,
  totalQuestionsCorrect: integer DEFAULT 0,
  currentStreak: integer DEFAULT 0,     // Consecutive days
  longestStreak: integer DEFAULT 0,
  lastActivityDate: timestamp,
  totalStudyTimeMinutes: integer DEFAULT 0,
  createdAt: timestamp DEFAULT now(),
  updatedAt: timestamp DEFAULT now()
}
```

**Foreign Keys**:
- `userId` → `users.id` (unique constraint = one-to-one)

**Computed Fields** (application-level):
```typescript
accuracy = (totalQuestionsCorrect / totalQuestionsAttempted) * 100
```

**Purpose**: Dashboard statistics, leaderboards, gamification

---

#### 6. `aiConversations` Table

Stores AI tutor conversation history (currently not used, prepared for future).

```typescript
{
  id: serial PRIMARY KEY,
  userId: integer NOT NULL,             // FK to users
  questionId: integer NOT NULL,         // FK to questions
  messages: jsonb NOT NULL,             // Array of message objects
  createdAt: timestamp DEFAULT now(),
  updatedAt: timestamp DEFAULT now()
}
```

**Message Format** (JSONB):
```typescript
[
  {
    role: 'user' | 'assistant',
    content: string,
    timestamp: string
  }
]
```

**Foreign Keys**:
- `userId` → `users.id`
- `questionId` → `questions.id`

**Purpose**: Conversation persistence for analysis and continuation

---

#### 7. `userSubjects` Table

User subject preferences (currently minimal usage).

```typescript
{
  id: serial PRIMARY KEY,
  userId: integer NOT NULL,             // FK to users
  subjectId: integer NOT NULL,          // FK to subjects
  isFavorite: boolean DEFAULT false,
  createdAt: timestamp DEFAULT now()
}
```

**Foreign Keys**:
- `userId` → `users.id`
- `subjectId` → `subjects.id`

**Purpose**: Personalization, favorite subjects

---

### Database Migrations

The platform uses Drizzle Kit for migrations:

```bash
# Generate migration from schema changes
npm run db:generate

# Apply migrations to database
npm run db:push

# Seed sample data
npm run db:seed

# Open database GUI
npm run db:studio
```

**Migration Files**: Stored in `/drizzle/` directory

---

## API Reference

### Base URL

```
Production: https://your-domain.vercel.app
Development: http://localhost:3000
```

### Authentication

All API endpoints require authentication via Clerk. Include Clerk session token in requests.

**Headers**:
```
Authorization: Bearer <clerk-session-token>
Cookie: __session=<clerk-session-cookie>
```

---

### Endpoints

#### 1. POST `/api/ai/chat`

**Description**: Interact with AI tutor using Socratic method

**Authentication**: Required

**Request Body**:
```typescript
{
  messages: Array<{
    role: 'user' | 'assistant',
    content: string
  }>,
  question: {
    id: number,
    title: string,
    content: string,
    difficulty: 'easy' | 'medium' | 'hard',
    correctAnswer: string,
    explanation: string
  },
  userAnswer?: string              // Optional: student's current answer
}
```

**Response** (200 OK):
```json
{
  "response": "Let's think about this step by step. What do you know about quadratic equations?"
}
```

**Error Responses**:
```json
// 401 Unauthorized
{ "error": "Unauthorized" }

// 500 Internal Server Error
{ "error": "Failed to get AI response", "details": "..." }
```

**Example**:
```typescript
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'I don\'t understand this question' }
    ],
    question: questionData,
    userAnswer: 'x = 5'
  })
});

const data = await response.json();
console.log(data.response);
```

---

#### 2. POST `/api/ai/evaluate`

**Description**: Evaluate student answer and update progress

**Authentication**: Required

**Request Body**:
```typescript
{
  question: {
    id: number,
    title: string,
    content: string,
    questionType: 'multiple_choice' | 'short_answer' | 'essay' | 'calculation',
    difficulty: 'easy' | 'medium' | 'hard',
    correctAnswer: string,
    explanation: string,
    options?: Record<string, string>
  },
  userAnswer: string,
  userId: number,                  // Internal user ID (from database)
  questionId: number
}
```

**Response** (200 OK):
```json
{
  "isCorrect": true,
  "score": 95,
  "feedback": "Excellent work! Your answer demonstrates a clear understanding of the concept.",
  "suggestions": [
    "Consider explaining the reasoning behind your calculation",
    "You could also mention the units in your final answer"
  ]
}
```

**Side Effects**:
- Updates `userProgress` table (attempts, score, userAnswer)
- Updates `userStats` table (totals, streaks)
- Calculates streak based on `lastActivityDate`

**Error Responses**:
```json
// 401 Unauthorized
{ "error": "Unauthorized" }

// 500 Internal Server Error
{ "error": "Failed to evaluate answer", "details": "..." }
```

**Example**:
```typescript
const response = await fetch('/api/ai/evaluate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    question: questionData,
    userAnswer: 'The answer is 42 meters per second',
    userId: 123,
    questionId: 456
  })
});

const evaluation = await response.json();
if (evaluation.isCorrect) {
  console.log(`Score: ${evaluation.score}/100`);
}
```

---

#### 3. POST `/api/ai/hint`

**Description**: Generate contextual hint based on question and conversation

**Authentication**: Required

**Request Body**:
```typescript
{
  question: {
    id: number,
    title: string,
    content: string,
    correctAnswer: string,
    explanation: string
  },
  conversationHistory: Array<{
    role: 'user' | 'assistant',
    content: string
  }>
}
```

**Response** (200 OK):
```json
{
  "hint": "Think about what happens to the velocity when acceleration is constant. Can you write the equation for this relationship?"
}
```

**Error Responses**:
```json
// 401 Unauthorized
{ "error": "Unauthorized" }

// 500 Internal Server Error
{ "error": "Failed to generate hint", "details": "..." }
```

**Example**:
```typescript
const response = await fetch('/api/ai/hint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    question: questionData,
    conversationHistory: chatMessages
  })
});

const data = await response.json();
console.log(data.hint);
```

---

### Rate Limits

**Current Implementation**: None (relies on Vercel serverless limits)

**Recommended for Production**:
- 100 requests/minute per user for chat endpoint
- 50 requests/minute per user for evaluate endpoint
- 30 requests/minute per user for hint endpoint

---

### Error Handling

All endpoints follow consistent error structure:

```typescript
{
  error: string,           // Human-readable error message
  details?: string,        // Technical details (dev mode only)
  code?: string           // Error code for client handling
}
```

---

## Authentication & Authorization

### Authentication Provider: Clerk

**Why Clerk?**
- Production-ready authentication
- Built-in UI components
- Social login support
- Webhook support for user sync
- Excellent Next.js integration

### Implementation Details

#### 1. Middleware Protection

File: `/src/middleware.ts`

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)'
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

**Protected Routes**:
- `/dashboard`
- `/practice/*`
- `/api/*`

**Public Routes**:
- `/` (landing page)
- `/sign-in`
- `/sign-up`

---

#### 2. Server Component Authentication

```typescript
import { auth, currentUser } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  // Get Clerk user ID
  const { userId: clerkId } = await auth();

  // Get full user object
  const clerkUser = await currentUser();

  // Get or create user in database
  const user = await getOrCreateUser(
    clerkId,
    clerkUser.emailAddresses[0].emailAddress,
    clerkUser.firstName,
    clerkUser.lastName
  );

  return <Dashboard user={user} />;
}
```

---

#### 3. API Route Authentication

```typescript
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Check authentication
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Continue with authenticated logic...
}
```

---

#### 4. User Synchronization

Helper function: `/src/lib/db/utils.ts` (to be created)

```typescript
import { db } from '@/lib/db';
import { users, userStats } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(
  clerkId: string,
  email: string,
  firstName?: string | null,
  lastName?: string | null
) {
  // Check if user exists
  let [user] = await db.select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (!user) {
    // Create user
    [user] = await db.insert(users)
      .values({
        clerkId,
        email,
        firstName: firstName ?? undefined,
        lastName: lastName ?? undefined,
      })
      .returning();

    // Create user stats
    await db.insert(userStats)
      .values({ userId: user.id });
  }

  return user;
}
```

---

### Clerk Configuration

**Environment Variables**:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

**Sign-In/Sign-Up Pages**:
- Pre-built Clerk components
- Located at `/sign-in` and `/sign-up`
- Customizable appearance via Clerk dashboard

**Social Providers** (configurable in Clerk dashboard):
- Google
- GitHub
- Microsoft
- etc.

---

### Authorization Levels

**Current**: Single-tier (all authenticated users have same permissions)

**Future Recommendations**:
```typescript
enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin'
}

// Add to users table
role: UserRole DEFAULT 'student'
```

**Potential RBAC**:
- **Students**: Answer questions, view own progress
- **Teachers**: View student progress, manage questions
- **Admins**: Full system access

---

## AI Components

### OpenAI Integration

**Model**: GPT-4o (`gpt-4o`)
**Provider**: OpenAI API

### Configuration

File: `/src/lib/ai/client.ts`

```typescript
import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

---

### 1. AI Tutor (Socratic Method)

File: `/src/lib/ai/tutor.ts`

**Function**: `getAITutorResponse()`

```typescript
export async function getAITutorResponse(
  messages: Message[],
  question: Question,
  userAnswer?: string
): Promise<string> {
  const systemPrompt = `You are an AI tutor for IB students using the Socratic method...`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ],
    temperature: 0.7,
    max_tokens: 500
  });

  return completion.choices[0].message.content || '';
}
```

**Key Characteristics**:
- **Temperature**: 0.7 (creative but focused)
- **Max Tokens**: 500 (concise responses)
- **Method**: Socratic questioning
- **Behavior**:
  - Never gives direct answers
  - Asks probing questions
  - Provides incremental guidance
  - Encourages critical thinking

**System Prompt**:
```
You are an AI tutor for IB (International Baccalaureate) students. Your role is to guide students to discover answers themselves using the Socratic method.

Key principles:
1. NEVER give direct answers
2. Ask thought-provoking questions
3. Break down complex problems into smaller steps
4. Acknowledge correct reasoning
5. Gently redirect misconceptions
6. Use the student's current answer to guide your questions
7. Be encouraging and supportive
8. Adapt your language to IB level (ages 16-19)

When a student asks for help:
- Ask what they already know about the topic
- Guide them to identify relevant concepts
- Help them make connections
- Encourage them to try an approach

You have access to:
- The question they're working on
- Their current answer attempt (if any)
- The conversation history
```

---

### 2. Answer Evaluation

**Function**: `evaluateAnswer()`

```typescript
export async function evaluateAnswer(
  question: Question,
  userAnswer: string
): Promise<Evaluation> {
  const prompt = `Evaluate this answer...`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    response_format: { type: 'json_object' }
  });

  return JSON.parse(completion.choices[0].message.content || '{}');
}
```

**Response Format** (JSON):
```typescript
{
  isCorrect: boolean,
  score: number,              // 0-100
  feedback: string,           // Detailed feedback
  suggestions: string[]       // Improvement suggestions
}
```

**Evaluation Criteria**:
- **Multiple Choice**: Exact match
- **Short Answer**: Semantic similarity + key concepts
- **Essay**: Structure, arguments, evidence, coherence
- **Calculation**: Correct answer + methodology

**Key Characteristics**:
- **Temperature**: 0.3 (consistent, objective)
- **Response Format**: JSON object (structured)
- **Scoring**: 0-100 scale
- **Feedback**: Constructive and specific

---

### 3. Hint Generation

**Function**: `generateHint()`

```typescript
export async function generateHint(
  question: Question,
  conversationHistory: Message[]
): Promise<string> {
  const prompt = `Generate a hint that guides without giving away the answer...`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 200
  });

  return completion.choices[0].message.content || '';
}
```

**Hint Levels** (progressive):
1. **First Hint**: General approach or concept
2. **Second Hint**: Specific formula or method
3. **Third Hint**: Step-by-step outline

**Context-Aware**: Uses conversation history to avoid repeating hints

---

### Cost Considerations

**GPT-4o Pricing** (as of 2026):
- Input: $2.50 per 1M tokens
- Output: $10.00 per 1M tokens

**Estimated Costs per User Session** (30 minutes):
- Chat interactions: ~15 messages × 500 tokens = 7,500 tokens
- Answer evaluation: 3 evaluations × 1,000 tokens = 3,000 tokens
- Hints: 2 hints × 300 tokens = 600 tokens
- **Total**: ~11,100 tokens ≈ $0.11 per session

**Optimization Strategies**:
1. Cache common responses
2. Limit conversation history context
3. Use token limits effectively
4. Implement rate limiting

---

## Frontend Components

### Component Architecture

```
src/
├── app/                                  # Next.js App Router
│   ├── page.tsx                         # Landing page
│   ├── layout.tsx                       # Root layout (Clerk provider)
│   ├── dashboard/
│   │   └── page.tsx                    # Dashboard (server component)
│   ├── practice/
│   │   └── [subject]/
│   │       └── page.tsx                # Practice page (server component)
│   └── api/ai/                         # API routes
└── components/
    └── QuestionPractice.tsx            # Main practice UI (client component)
```

---

### 1. Landing Page

File: `/src/app/page.tsx`

**Type**: Server Component

**Features**:
- Hero section with CTA
- Feature highlights
- "How it works" section
- Responsive design

**Key Elements**:
```tsx
<Link href="/sign-up">
  <Button>Get Started</Button>
</Link>
```

---

### 2. Dashboard

File: `/src/app/dashboard/page.tsx`

**Type**: Server Component

**Data Fetching**:
```typescript
// Fetch user
const user = await getOrCreateUser(...);

// Fetch subjects
const subjects = await db.select().from(subjectsTable);

// Fetch user stats
const [stats] = await db.select()
  .from(userStats)
  .where(eq(userStats.userId, user.id));
```

**Display Elements**:
- Welcome message with user name
- Statistics cards:
  - Questions attempted
  - Accuracy percentage
  - Current streak
  - Longest streak
- Subject grid (11 cards)
- Subject icons (emojis)

**Subject Card**:
```tsx
<Link href={`/practice/${subject.name}`}>
  <div className="subject-card">
    <span className="icon">{subject.icon}</span>
    <h3>{subject.displayName}</h3>
    <p>{subject.description}</p>
  </div>
</Link>
```

---

### 3. Practice Page

File: `/src/app/practice/[subject]/page.tsx`

**Type**: Server Component (wrapper for client component)

**Dynamic Route**: `/practice/mathematics`, `/practice/physics`, etc.

**Data Fetching**:
```typescript
// Fetch subject
const [subject] = await db.select()
  .from(subjects)
  .where(eq(subjects.name, params.subject));

// Fetch questions (20 questions, ordered by ID)
const questions = await db.select()
  .from(questionsTable)
  .where(eq(questionsTable.subjectId, subject.id))
  .orderBy(questionsTable.id)
  .limit(20);
```

**Renders**: `<QuestionPractice>` client component

---

### 4. QuestionPractice Component

File: `/src/components/QuestionPractice.tsx`

**Type**: Client Component (`'use client'`)

**Props**:
```typescript
{
  questions: Question[],
  userId: number
}
```

**State Management**:
```typescript
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [userAnswer, setUserAnswer] = useState('');
const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
const [chatMessages, setChatMessages] = useState<Message[]>([]);
const [showChat, setShowChat] = useState(false);
const [chatInput, setChatInput] = useState('');
```

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│ Question 1 of 20                          [Difficulty]   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Question Content                                        │
│                                                          │
│  [ Answer Input ]                                        │
│                                                          │
│  [Submit Answer] [Get Hint] [AI Assistant]              │
│                                                          │
│  [← Previous]                      [Next →]             │
│                                                          │
├─────────────────────────────────────────────────────────┤
│ AI Assistant Chat (collapsible)                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Chat messages...                                 │   │
│  └─────────────────────────────────────────────────┘   │
│  [Message input]                           [Send]       │
└─────────────────────────────────────────────────────────┘
```

**Key Features**:

1. **Question Display**:
   - Question number and total
   - Difficulty badge (Easy/Medium/Hard)
   - Question content
   - Options (if multiple choice)

2. **Answer Input**:
   - Radio buttons (multiple choice)
   - Textarea (short answer, essay, calculation)

3. **Action Buttons**:
   - Submit Answer → Evaluate via AI
   - Get Hint → Request hint
   - Toggle AI Assistant → Show/hide chat

4. **Navigation**:
   - Previous/Next buttons
   - Disabled when appropriate

5. **Evaluation Display**:
   - Score badge
   - Feedback message
   - Improvement suggestions
   - Correct answer (if incorrect)

6. **AI Chat Panel**:
   - Collapsible sidebar
   - Message history
   - Input field
   - Real-time responses

**API Interactions**:
```typescript
// Submit answer
const response = await fetch('/api/ai/evaluate', {
  method: 'POST',
  body: JSON.stringify({ question, userAnswer, userId, questionId })
});

// Send chat message
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  body: JSON.stringify({ messages, question, userAnswer })
});

// Get hint
const response = await fetch('/api/ai/hint', {
  method: 'POST',
  body: JSON.stringify({ question, conversationHistory })
});
```

---

### Styling

**Framework**: Tailwind CSS 4

**Design System**:
- **Colors**:
  - Primary: Blue/Indigo gradient
  - Success: Green
  - Warning: Yellow/Orange
  - Error: Red
- **Typography**: Geist Sans (sans-serif), Geist Mono (monospace)
- **Spacing**: 4px base unit (Tailwind default)
- **Responsive**: Mobile-first breakpoints

**Key Utility Classes**:
```css
.difficulty-easy: bg-green-500
.difficulty-medium: bg-yellow-500
.difficulty-hard: bg-red-500

.button-primary: bg-blue-600 hover:bg-blue-700
.button-secondary: bg-gray-600 hover:bg-gray-700

.card: rounded-lg shadow-md p-6
```

---

## Setup & Configuration

### Prerequisites

1. **Node.js**: v18.x or higher
2. **npm**: v9.x or higher
3. **PostgreSQL**: Neon serverless account
4. **Clerk**: Account with application configured
5. **OpenAI**: API key with GPT-4o access

---

### Step-by-Step Setup

#### 1. Clone Repository

```bash
git clone https://github.com/your-org/ib-learning-platform.git
cd ib-learning-platform
```

---

#### 2. Install Dependencies

```bash
npm install
```

---

#### 3. Environment Variables

Create `.env.local`:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# OpenAI API
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

**Getting Credentials**:

**Clerk**:
1. Sign up at https://clerk.com
2. Create new application
3. Copy publishable key and secret key
4. Configure sign-in/sign-up URLs: `/sign-in`, `/sign-up`

**Neon**:
1. Sign up at https://neon.tech
2. Create new project
3. Copy connection string
4. Enable SSL mode

**OpenAI**:
1. Sign up at https://platform.openai.com
2. Generate API key
3. Enable GPT-4o model access

---

#### 4. Database Setup

```bash
# Generate migration files
npm run db:generate

# Apply schema to database
npm run db:push

# Seed sample data (subjects + questions)
npm run db:seed
```

**Verify**:
```bash
# Open Drizzle Studio (database GUI)
npm run db:studio
```

Navigate to http://localhost:4983 to view database.

---

#### 5. Run Development Server

```bash
npm run dev
```

Navigate to http://localhost:3000

---

#### 6. Test Authentication

1. Click "Get Started" or "Sign In"
2. Create account via Clerk
3. Verify redirect to dashboard
4. Check database for new user record

---

#### 7. Test Question Practice

1. From dashboard, click any subject
2. Verify questions load
3. Submit an answer
4. Verify evaluation appears
5. Open AI assistant and send message
6. Request a hint

---

### Package Scripts

```json
{
  "dev": "next dev",                    // Development server
  "build": "next build",                // Production build
  "start": "next start",                // Production server
  "lint": "next lint",                  // ESLint
  "db:generate": "drizzle-kit generate", // Generate migrations
  "db:push": "drizzle-kit push",        // Apply schema
  "db:seed": "tsx src/lib/db/seed.ts",  // Seed data
  "db:studio": "drizzle-kit studio"     // Database GUI
}
```

---

## Code Examples

### Example 1: Adding a New Subject

```typescript
// 1. Add to enum in schema.ts
export const subjectEnum = pgEnum('subject', [
  'mathematics',
  'physics',
  // ... existing subjects
  'art_design'  // NEW
]);

// 2. Run migration
// $ npm run db:generate
// $ npm run db:push

// 3. Seed new subject
await db.insert(subjects).values({
  name: 'art_design',
  displayName: 'Art & Design',
  description: 'IB Visual Arts',
  icon: '🎨'
});

// 4. Add questions for new subject
await db.insert(questions).values({
  subjectId: artSubjectId,
  questionType: 'essay',
  difficulty: 'medium',
  title: 'Art Analysis',
  content: 'Analyze the use of color in Van Gogh\'s Starry Night...',
  correctAnswer: '[Sample answer]',
  explanation: '[Detailed explanation]'
});
```

---

### Example 2: Creating Custom Question Type

```typescript
// 1. Add enum value
export const questionTypeEnum = pgEnum('question_type', [
  'multiple_choice',
  'short_answer',
  'essay',
  'calculation',
  'matching'  // NEW
]);

// 2. Update Question type
export type Question = {
  // ... existing fields
  matchingPairs?: { left: string; right: string }[];
};

// 3. Update QuestionPractice component
function renderAnswerInput() {
  if (question.questionType === 'matching') {
    return <MatchingPairsInput onChange={setUserAnswer} />;
  }
  // ... existing types
}

// 4. Update AI evaluation prompt
const prompt = `
Question type: ${question.questionType}
${question.questionType === 'matching' ?
  'The answer should be a JSON array of matched pairs.' :
  ''}
`;
```

---

### Example 3: Fetching User Progress for Analytics

```typescript
import { db } from '@/lib/db';
import { userProgress, questions } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function getUserProgressBySubject(
  userId: number,
  subjectId: number
) {
  return await db
    .select({
      questionTitle: questions.title,
      attempts: userProgress.attempts,
      correctAttempts: userProgress.correctAttempts,
      lastScore: userProgress.score,
      lastAttemptedAt: userProgress.lastAttemptedAt,
      isCompleted: userProgress.isCompleted
    })
    .from(userProgress)
    .innerJoin(questions, eq(userProgress.questionId, questions.id))
    .where(
      and(
        eq(userProgress.userId, userId),
        eq(userProgress.subjectId, subjectId)
      )
    )
    .orderBy(desc(userProgress.lastAttemptedAt));
}

// Usage in server component
const progress = await getUserProgressBySubject(user.id, subjectId);
const accuracy = progress.reduce((acc, p) =>
  acc + (p.correctAttempts / p.attempts), 0
) / progress.length;
```

---

### Example 4: Adding Conversation Persistence

```typescript
// 1. Save conversation after each message
import { aiConversations } from '@/lib/db/schema';

async function saveConversation(
  userId: number,
  questionId: number,
  messages: Message[]
) {
  const [existing] = await db
    .select()
    .from(aiConversations)
    .where(
      and(
        eq(aiConversations.userId, userId),
        eq(aiConversations.questionId, questionId)
      )
    );

  if (existing) {
    await db
      .update(aiConversations)
      .set({ messages, updatedAt: new Date() })
      .where(eq(aiConversations.id, existing.id));
  } else {
    await db.insert(aiConversations).values({
      userId,
      questionId,
      messages
    });
  }
}

// 2. Load conversation on question load
async function loadConversation(userId: number, questionId: number) {
  const [conversation] = await db
    .select()
    .from(aiConversations)
    .where(
      and(
        eq(aiConversations.userId, userId),
        eq(aiConversations.questionId, questionId)
      )
    );

  return conversation?.messages || [];
}

// 3. Update QuestionPractice to use persistence
useEffect(() => {
  async function loadChat() {
    const messages = await fetch('/api/ai/conversation', {
      method: 'POST',
      body: JSON.stringify({ questionId: currentQuestion.id })
    }).then(r => r.json());

    setChatMessages(messages);
  }
  loadChat();
}, [currentQuestion.id]);
```

---

### Example 5: Adding Teacher Dashboard

```typescript
// 1. Create teacher page
// File: /src/app/teacher/dashboard/page.tsx

import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users, userStats, userProgress } from '@/lib/db/schema';

export default async function TeacherDashboard() {
  const { userId } = await auth();

  // Fetch all students with stats
  const students = await db
    .select({
      id: users.id,
      name: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
      email: users.email,
      questionsAttempted: userStats.totalQuestionsAttempted,
      accuracy: sql<number>`
        CASE
          WHEN ${userStats.totalQuestionsAttempted} > 0
          THEN (${userStats.totalQuestionsCorrect}::float /
                ${userStats.totalQuestionsAttempted}::float * 100)
          ELSE 0
        END
      `,
      currentStreak: userStats.currentStreak
    })
    .from(users)
    .leftJoin(userStats, eq(users.id, userStats.userId))
    .orderBy(desc(userStats.totalQuestionsAttempted));

  return (
    <div>
      <h1>Student Progress</h1>
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Questions</th>
            <th>Accuracy</th>
            <th>Streak</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.questionsAttempted}</td>
              <td>{student.accuracy.toFixed(1)}%</td>
              <td>{student.currentStreak} days</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

### Example 6: Implementing Study Time Tracking

```typescript
// 1. Track session start time
// In QuestionPractice.tsx

const [sessionStartTime] = useState(Date.now());

useEffect(() => {
  // Save study time on unmount
  return () => {
    const studyTimeMinutes = Math.floor((Date.now() - sessionStartTime) / 60000);

    fetch('/api/user/study-time', {
      method: 'POST',
      body: JSON.stringify({ minutes: studyTimeMinutes })
    });
  };
}, [sessionStartTime]);

// 2. Create API endpoint
// File: /src/app/api/user/study-time/route.ts

import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { userStats } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const { minutes } = await request.json();

  const [user] = await db.select()
    .from(users)
    .where(eq(users.clerkId, userId));

  await db
    .update(userStats)
    .set({
      totalStudyTimeMinutes: sql`${userStats.totalStudyTimeMinutes} + ${minutes}`
    })
    .where(eq(userStats.userId, user.id));

  return Response.json({ success: true });
}
```

---

## Deployment Guide

### Vercel Deployment (Recommended)

#### Why Vercel?

- Built specifically for Next.js
- Automatic CI/CD from Git
- Serverless functions (API routes)
- Edge network (low latency)
- Free SSL certificates
- Preview deployments for PRs

---

#### Deployment Steps

**1. Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-org/ib-learning.git
git push -u origin main
```

**2. Import to Vercel**

1. Go to https://vercel.com
2. Click "New Project"
3. Import Git repository
4. Select your repository

**3. Configure Environment Variables**

Add in Vercel dashboard:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-proj-xxxxx
```

**4. Deploy**

Click "Deploy" → Vercel builds and deploys automatically

**5. Custom Domain** (optional)

1. Add domain in Vercel dashboard
2. Update DNS records
3. SSL auto-provisioned

---

#### Deployment Configuration

File: `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

---

### Alternative: Docker Deployment

**Dockerfile**:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**Build and Run**:

```bash
docker build -t ib-learning .
docker run -p 3000:3000 --env-file .env.local ib-learning
```

---

### Alternative: Traditional Server (VPS)

**Requirements**:
- Ubuntu 22.04 LTS
- Node.js 18+
- Nginx (reverse proxy)
- PM2 (process manager)
- SSL certificate (Let's Encrypt)

**Setup**:

```bash
# 1. Install dependencies
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs nginx certbot python3-certbot-nginx
sudo npm install -g pm2

# 2. Clone and build
git clone https://github.com/your-org/ib-learning.git
cd ib-learning
npm install
npm run build

# 3. Start with PM2
pm2 start npm --name "ib-learning" -- start
pm2 save
pm2 startup

# 4. Configure Nginx
sudo nano /etc/nginx/sites-available/ib-learning

# Add configuration:
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 5. Enable site
sudo ln -s /etc/nginx/sites-available/ib-learning /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 6. SSL certificate
sudo certbot --nginx -d yourdomain.com
```

---

## Security Considerations

### 1. Authentication Security

✅ **Current Implementation**:
- Clerk handles authentication (industry-standard)
- Session-based auth with secure cookies
- Middleware protection on all routes
- API endpoint authentication checks

⚠️ **Recommendations**:
- Enable 2FA in Clerk dashboard
- Implement rate limiting on API endpoints
- Add CAPTCHA on sign-up (prevent bots)
- Configure session timeout (30 minutes idle)

---

### 2. API Security

✅ **Current Implementation**:
- All AI endpoints require authentication
- User isolation (users only access own data)

⚠️ **Vulnerabilities**:
- No rate limiting (susceptible to abuse)
- No request size limits
- API keys in environment variables (good) but exposed in committed files (⚠️ `.env.local` in repo)

**Recommendations**:

```typescript
// Add rate limiting
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
});

export async function POST(request: Request) {
  const { userId } = await auth();
  const { success } = await ratelimit.limit(userId);

  if (!success) {
    return new Response('Rate limit exceeded', { status: 429 });
  }

  // Continue...
}
```

---

### 3. Database Security

✅ **Current Implementation**:
- SSL mode required for connections
- Parameterized queries (Drizzle ORM prevents SQL injection)
- User data isolation via WHERE clauses

⚠️ **Recommendations**:
- Enable row-level security (RLS) in PostgreSQL
- Regular database backups
- Read replicas for analytics queries
- Connection pooling (PgBouncer)

---

### 4. Environment Variables

⚠️ **Critical Security Issue**:
- `.env.local` committed to repository (contains OpenAI API key)
- `vercel.json` contains sensitive keys

**Immediate Actions Required**:

```bash
# 1. Remove from Git history
git rm --cached .env.local
git rm --cached vercel.json

# 2. Add to .gitignore
echo ".env.local" >> .gitignore
echo "vercel.json" >> .gitignore

# 3. Rotate all API keys
- OpenAI: Generate new key
- Clerk: Generate new keys
- Update in Vercel dashboard

# 4. Commit changes
git add .gitignore
git commit -m "Security: Remove sensitive files from repo"
```

---

### 5. Input Validation

⚠️ **Current Implementation**: Minimal validation

**Recommendations**:

```typescript
import { z } from 'zod';

// Define schema
const evaluateSchema = z.object({
  question: z.object({
    id: z.number(),
    content: z.string().min(1).max(10000),
    // ...
  }),
  userAnswer: z.string().min(1).max(50000),
  userId: z.number(),
  questionId: z.number()
});

// Validate in API route
export async function POST(request: Request) {
  const body = await request.json();

  const result = evaluateSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      { error: 'Invalid input', details: result.error },
      { status: 400 }
    );
  }

  // Continue with validated data...
}
```

---

### 6. XSS Prevention

✅ **Current Implementation**:
- React automatically escapes content
- No use of `dangerouslySetInnerHTML`

⚠️ **Recommendations**:
- Sanitize AI responses (although OpenAI is generally safe)
- Content Security Policy (CSP) headers

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
          }
        ]
      }
    ];
  }
};
```

---

### 7. CORS Configuration

✅ **Current Implementation**: No CORS (Next.js API routes only)

⚠️ **If exposing API externally**:

```typescript
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const allowedOrigins = ['https://yourdomain.com'];

  const headers = {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  // Handle POST...
  return Response.json(data, { headers });
}
```

---

## Performance & Scalability

### Current Performance Profile

| Metric | Current | Target |
|--------|---------|--------|
| Time to First Byte (TTFB) | ~200ms | <300ms |
| First Contentful Paint (FCP) | ~800ms | <1.8s |
| Largest Contentful Paint (LCP) | ~1.2s | <2.5s |
| Time to Interactive (TTI) | ~2.0s | <3.8s |
| API Response Time (chat) | ~2-4s | <5s |
| API Response Time (evaluate) | ~1-3s | <3s |
| Database Query Time | ~50-100ms | <200ms |

---

### Scalability Considerations

#### 1. Database

**Current**: Neon serverless (auto-scales)

**Optimizations**:

```typescript
// Add indexes for common queries
CREATE INDEX idx_user_progress_user_subject ON user_progress(user_id, subject_id);
CREATE INDEX idx_questions_subject_difficulty ON questions(subject_id, difficulty);
CREATE INDEX idx_user_stats_user ON user_stats(user_id);

// Query optimization
const questions = await db
  .select()
  .from(questionsTable)
  .where(eq(questionsTable.subjectId, subjectId))
  .orderBy(questionsTable.id)
  .limit(20)
  .prepare('get_subject_questions'); // Prepared statement
```

**Connection Pooling**:
```typescript
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);
```

---

#### 2. API Rate Limiting

**Recommended**: Upstash Redis + Rate limiting

```bash
npm install @upstash/ratelimit @upstash/redis
```

Configuration:
- Chat: 30 requests/minute per user
- Evaluate: 20 requests/minute per user
- Hint: 10 requests/minute per user

---

#### 3. Caching Strategy

**Static Assets**: Vercel Edge Network (automatic)

**API Responses**:

```typescript
import { unstable_cache } from 'next/cache';

// Cache subject list (rarely changes)
const getSubjects = unstable_cache(
  async () => db.select().from(subjects),
  ['subjects'],
  { revalidate: 3600 } // 1 hour
);

// Cache questions per subject
const getQuestions = unstable_cache(
  async (subjectId: number) =>
    db.select().from(questions).where(eq(questions.subjectId, subjectId)),
  ['questions'],
  { revalidate: 1800, tags: ['questions'] } // 30 minutes
);
```

---

#### 4. AI Response Optimization

**Current**: Direct OpenAI API calls

**Optimizations**:

1. **Token Limit Management**:
```typescript
// Limit conversation history to last 10 messages
const recentMessages = messages.slice(-10);
```

2. **Streaming Responses** (for chat):
```typescript
const stream = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages,
  stream: true
});

for await (const chunk of stream) {
  // Send chunks to client as they arrive
}
```

3. **Response Caching** (for common questions):
```typescript
// Cache common question evaluations
const cacheKey = `eval:${questionId}:${userAnswer}`;
const cached = await redis.get(cacheKey);
if (cached) return cached;

const evaluation = await evaluateAnswer(...);
await redis.setex(cacheKey, 3600, evaluation); // 1 hour
```

---

#### 5. Image Optimization

**Current**: No images (emoji icons only)

**If adding images**:
```tsx
import Image from 'next/image';

<Image
  src="/subjects/mathematics.jpg"
  alt="Mathematics"
  width={400}
  height={300}
  loading="lazy"
  placeholder="blur"
/>
```

---

#### 6. Code Splitting

**Current**: Automatic (Next.js)

**Manual optimization**:
```typescript
import dynamic from 'next/dynamic';

// Lazy load heavy components
const QuestionPractice = dynamic(
  () => import('@/components/QuestionPractice'),
  { loading: () => <LoadingSpinner /> }
);
```

---

### Load Testing

**Recommended Tool**: k6

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
};

export default function () {
  const response = http.post('https://yourdomain.com/api/ai/chat', JSON.stringify({
    messages: [{ role: 'user', content: 'Help me' }],
    question: { /* ... */ }
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 5s': (r) => r.timings.duration < 5000,
  });

  sleep(1);
}
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors

**Error**: `Error: getaddrinfo ENOTFOUND`

**Causes**:
- Invalid `DATABASE_URL`
- Network connectivity issues
- Neon database paused (serverless)

**Solutions**:
```bash
# Verify DATABASE_URL format
echo $DATABASE_URL
# Should be: postgresql://user:pass@host/db?sslmode=require

# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Wake up Neon database (if paused)
curl https://console.neon.tech/api/v2/projects/YOUR_PROJECT_ID/endpoints/YOUR_ENDPOINT_ID/start
```

---

#### 2. Clerk Authentication Issues

**Error**: `Clerk: Missing publishable key`

**Causes**:
- Environment variables not set
- Wrong variable names
- Not restarted dev server after adding env vars

**Solutions**:
```bash
# Verify environment variables
echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
echo $CLERK_SECRET_KEY

# Restart dev server
npm run dev

# Check .env.local exists and has correct keys
cat .env.local
```

---

#### 3. OpenAI API Errors

**Error**: `Error: 429 Too Many Requests`

**Cause**: Rate limit exceeded

**Solutions**:
- Reduce request frequency
- Upgrade OpenAI plan
- Implement request queuing

**Error**: `Error: 401 Unauthorized`

**Cause**: Invalid API key

**Solutions**:
```bash
# Verify API key format
echo $OPENAI_API_KEY
# Should start with: sk-proj-

# Regenerate key at https://platform.openai.com/api-keys
```

---

#### 4. Build Errors

**Error**: `Type error: Property 'X' does not exist`

**Cause**: TypeScript type mismatch

**Solutions**:
```bash
# Clean build cache
rm -rf .next
npm run build

# Check TypeScript version
npx tsc --version

# Verify all types are properly imported
```

---

#### 5. Vercel Deployment Failures

**Error**: `Error: Command "npm run build" exited with 1`

**Causes**:
- Environment variables not set in Vercel
- Build-time errors
- Dependencies missing

**Solutions**:
1. Check Vercel deployment logs
2. Verify all environment variables in Vercel dashboard
3. Test build locally: `npm run build`
4. Check Node.js version matches (`.nvmrc` or `engines` in package.json)

---

### Debug Mode

Enable detailed logging:

```typescript
// Add to .env.local
DEBUG=true
NODE_ENV=development

// Use in code
if (process.env.DEBUG === 'true') {
  console.log('Detailed debug info:', data);
}
```

---

### Performance Debugging

```typescript
// Measure API response time
console.time('API Call');
const response = await fetch('/api/ai/chat', { ... });
console.timeEnd('API Call');

// Database query logging
import { drizzle } from 'drizzle-orm/neon-serverless';

const db = drizzle(pool, {
  logger: true // Logs all SQL queries
});
```

---

## Appendix

### A. Full Schema SQL

```sql
-- Enums
CREATE TYPE difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE question_type AS ENUM ('multiple_choice', 'short_answer', 'essay', 'calculation');
CREATE TYPE subject AS ENUM (
  'mathematics', 'physics', 'chemistry', 'biology', 'english',
  'history', 'geography', 'economics', 'business_management',
  'psychology', 'computer_science'
);

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subjects table
CREATE TABLE subjects (
  id SERIAL PRIMARY KEY,
  name subject UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions table
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  subject_id INTEGER NOT NULL REFERENCES subjects(id),
  question_type question_type NOT NULL,
  difficulty difficulty NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  tags TEXT[],
  learning_objectives TEXT[],
  marking_criteria JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User progress table
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  question_id INTEGER NOT NULL REFERENCES questions(id),
  subject_id INTEGER NOT NULL REFERENCES subjects(id),
  attempts INTEGER DEFAULT 0,
  correct_attempts INTEGER DEFAULT 0,
  last_attempted_at TIMESTAMP,
  is_completed BOOLEAN DEFAULT FALSE,
  user_answer TEXT,
  score INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User stats table
CREATE TABLE user_stats (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id),
  total_questions_attempted INTEGER DEFAULT 0,
  total_questions_correct INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date TIMESTAMP,
  total_study_time_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI conversations table
CREATE TABLE ai_conversations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  question_id INTEGER NOT NULL REFERENCES questions(id),
  messages JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User subjects table
CREATE TABLE user_subjects (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  subject_id INTEGER NOT NULL REFERENCES subjects(id),
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_user_progress_user_subject ON user_progress(user_id, subject_id);
CREATE INDEX idx_questions_subject_difficulty ON questions(subject_id, difficulty);
CREATE INDEX idx_user_stats_user ON user_stats(user_id);
CREATE INDEX idx_ai_conversations_user_question ON ai_conversations(user_id, question_id);
```

---

### B. API Response Examples

**Chat Response**:
```json
{
  "response": "That's a great start! You've identified the key variable. Now, can you tell me what mathematical operation you would use to find the rate of change?"
}
```

**Evaluate Response**:
```json
{
  "isCorrect": false,
  "score": 65,
  "feedback": "You've got the right approach, but there's a small error in your calculation. You correctly identified that you need to use the quadratic formula, but when calculating the discriminant, you used b instead of b². Let's work through it again.",
  "suggestions": [
    "Double-check the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a",
    "Remember to square the b term in the discriminant",
    "Verify your final answer by substituting it back into the original equation"
  ]
}
```

**Hint Response**:
```json
{
  "hint": "Think about the relationship between force, mass, and acceleration. What fundamental law of physics describes this relationship? Try writing it as an equation first."
}
```

---

### C. Glossary

| Term | Definition |
|------|------------|
| **Socratic Method** | Teaching approach that uses questions to guide learning |
| **Drizzle ORM** | TypeScript-first ORM for SQL databases |
| **Server Component** | React component that renders on the server (Next.js 13+) |
| **Client Component** | React component that renders in the browser |
| **Clerk** | Authentication and user management platform |
| **Neon** | Serverless PostgreSQL database platform |
| **GPT-4o** | OpenAI's multimodal AI model (text + vision) |
| **IB** | International Baccalaureate (educational program) |
| **Streak** | Consecutive days of activity |
| **Vercel** | Deployment platform for Next.js applications |

---

### D. Resources

**Official Documentation**:
- Next.js: https://nextjs.org/docs
- React: https://react.dev
- Drizzle ORM: https://orm.drizzle.team
- Clerk: https://clerk.com/docs
- OpenAI: https://platform.openai.com/docs
- Tailwind CSS: https://tailwindcss.com/docs

**Community**:
- GitHub Repository: [Your repo URL]
- Discord: [Your Discord invite]
- Email Support: support@yourdomain.com

---

### E. License

**License**: MIT (or your chosen license)

**Attribution**: When integrating this product, please retain attribution to original authors.

---

## Contact & Support

**Developer Contact**:
- Email: dev@yourdomain.com
- GitHub: github.com/your-org
- Documentation: docs.yourdomain.com

**Technical Support**:
- Response Time: 24-48 hours
- Support Tiers: Community (free), Professional ($), Enterprise ($$)

---

**Document Version**: 1.0
**Last Updated**: January 2026
**Maintained By**: [Your Organization]

---

## Quick Start Checklist

For developers integrating this product:

- [ ] Read Product Overview section
- [ ] Review Tech Stack & Dependencies
- [ ] Understand Database Schema
- [ ] Study API Reference
- [ ] Set up local development environment
- [ ] Test all API endpoints
- [ ] Review security considerations
- [ ] Plan integration strategy (Option 1-4)
- [ ] Implement POC in test environment
- [ ] Load testing and performance validation
- [ ] Security audit
- [ ] Production deployment

**Estimated Integration Time**: 2-4 weeks (depending on integration option)

---

*End of Integration Guide*
