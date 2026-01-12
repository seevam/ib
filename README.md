# IB Learning Platform

An AI-powered learning platform for IB (International Baccalaureate) students to practice questions across all subjects with personalized cognitive learning support.

## Features

- **AI-Powered Tutoring**: Get personalized guidance using OpenAI's GPT-4 that builds cognitive logic and deepens understanding
- **Multiple Subjects**: Practice questions from Mathematics, Physics, Chemistry, Biology, English, History, Geography, Economics, Business Management, Psychology, and Computer Science
- **Progress Tracking**: Monitor your improvement with detailed analytics, streaks, and performance metrics
- **Interactive Learning**: Real-time AI assistance with hints, guided questions, and explanations
- **Secure Authentication**: User authentication powered by Clerk
- **Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Authentication**: Clerk
- **Database**: Neon (PostgreSQL)
- **ORM**: Drizzle ORM
- **AI**: OpenAI GPT-4
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Clerk account (for authentication)
- A Neon account (for database)
- An OpenAI API key

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Fill in your credentials:

```env
# Clerk Authentication
# Get from: https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Neon Database
# Get from: https://console.neon.tech
DATABASE_URL=your_neon_database_url

# OpenAI API
# Get from: https://platform.openai.com
OPENAI_API_KEY=your_openai_api_key
```

### 3. Set Up the Database

Generate the database schema:

```bash
npm run db:generate
```

Push the schema to your Neon database:

```bash
npm run db:push
```

Seed the database with sample questions:

```bash
npm run db:seed
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ib/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/               # API routes
│   │   │   └── ai/           # AI endpoints (chat, evaluate, hint)
│   │   ├── dashboard/        # Dashboard page
│   │   ├── practice/         # Practice pages
│   │   ├── sign-in/          # Sign in page
│   │   └── sign-up/          # Sign up page
│   ├── components/            # React components
│   │   └── QuestionPractice.tsx
│   ├── lib/
│   │   ├── ai/               # AI integration
│   │   │   ├── client.ts    # OpenAI client
│   │   │   └── tutor.ts     # AI tutor logic
│   │   └── db/               # Database
│   │       ├── index.ts     # Database connection
│   │       ├── schema.ts    # Drizzle schema
│   │       └── seed.ts      # Database seeding
│   └── middleware.ts         # Clerk middleware
├── drizzle.config.ts         # Drizzle configuration
├── .env.example              # Environment variables template
└── package.json
```

## Key Features Explained

### AI Cognitive Tutor

The AI tutor uses a Socratic teaching approach to help students develop deep understanding:

- **Guided Learning**: Asks probing questions instead of giving direct answers
- **Contextual Hints**: Provides hints based on the student's progress
- **Answer Evaluation**: Gives detailed feedback on submitted answers
- **Adaptive Responses**: Adjusts to the student's level of understanding

### Question Practice

Students can:
- Choose from multiple subjects
- Practice questions of varying difficulty (easy, medium, hard)
- Answer multiple choice, short answer, essay, and calculation questions
- Get AI assistance during practice
- Track their progress and accuracy

### Progress Tracking

- Total questions attempted and correct answers
- Accuracy percentage
- Current and longest streaks
- Per-subject progress
- Detailed analytics

## Database Schema

The platform uses the following main tables:

- **users**: Student accounts (synced with Clerk)
- **subjects**: IB subjects
- **questions**: Question bank
- **user_progress**: Individual question progress
- **user_stats**: Overall user statistics
- **ai_conversations**: AI chat history

## API Endpoints

### POST /api/ai/chat
Chat with the AI tutor about a question.

### POST /api/ai/evaluate
Evaluate a student's answer and provide feedback.

### POST /api/ai/hint
Generate a hint for the current question.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The platform is optimized for Vercel deployment with automatic builds and serverless functions.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Drizzle Studio
- `npm run db:seed` - Seed database with sample data

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own learning platform!

---

Built with ❤️ for IB students worldwide
