import { pgTable, text, serial, integer, timestamp, boolean, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const difficultyEnum = pgEnum('difficulty', ['easy', 'medium', 'hard']);
export const questionTypeEnum = pgEnum('question_type', ['multiple_choice', 'short_answer', 'essay', 'calculation']);
export const subjectEnum = pgEnum('subject', [
  'mathematics',
  'physics',
  'chemistry',
  'biology',
  'english',
  'history',
  'geography',
  'economics',
  'business_management',
  'psychology',
  'computer_science',
]);

// Users table (synced with Clerk)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Subjects table
export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  name: subjectEnum('name').notNull().unique(),
  displayName: text('display_name').notNull(),
  description: text('description'),
  icon: text('icon'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Questions table
export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  subjectId: integer('subject_id').references(() => subjects.id).notNull(),
  questionType: questionTypeEnum('question_type').notNull(),
  difficulty: difficultyEnum('difficulty').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  options: jsonb('options'), // For multiple choice questions
  correctAnswer: text('correct_answer').notNull(),
  explanation: text('explanation').notNull(),
  tags: text('tags').array(),
  learningObjectives: text('learning_objectives').array(),
  markingCriteria: jsonb('marking_criteria'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User progress table
export const userProgress = pgTable('user_progress', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  questionId: integer('question_id').references(() => questions.id).notNull(),
  subjectId: integer('subject_id').references(() => subjects.id).notNull(),
  attempts: integer('attempts').default(0).notNull(),
  correctAttempts: integer('correct_attempts').default(0).notNull(),
  lastAttemptedAt: timestamp('last_attempted_at'),
  isCompleted: boolean('is_completed').default(false).notNull(),
  userAnswer: text('user_answer'),
  score: integer('score'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// AI conversation history
export const aiConversations = pgTable('ai_conversations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  questionId: integer('question_id').references(() => questions.id).notNull(),
  messages: jsonb('messages').notNull(), // Array of {role, content, timestamp}
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User subject preferences
export const userSubjects = pgTable('user_subjects', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  subjectId: integer('subject_id').references(() => subjects.id).notNull(),
  isFavorite: boolean('is_favorite').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Learning streaks and achievements
export const userStats = pgTable('user_stats', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull().unique(),
  totalQuestionsAttempted: integer('total_questions_attempted').default(0).notNull(),
  totalQuestionsCorrect: integer('total_questions_correct').default(0).notNull(),
  currentStreak: integer('current_streak').default(0).notNull(),
  longestStreak: integer('longest_streak').default(0).notNull(),
  lastActivityDate: timestamp('last_activity_date'),
  totalStudyTimeMinutes: integer('total_study_time_minutes').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  progress: many(userProgress),
  conversations: many(aiConversations),
  userSubjects: many(userSubjects),
  stats: one(userStats),
}));

export const subjectsRelations = relations(subjects, ({ many }) => ({
  questions: many(questions),
  userProgress: many(userProgress),
  userSubjects: many(userSubjects),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [questions.subjectId],
    references: [subjects.id],
  }),
  userProgress: many(userProgress),
  conversations: many(aiConversations),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  question: one(questions, {
    fields: [userProgress.questionId],
    references: [questions.id],
  }),
  subject: one(subjects, {
    fields: [userProgress.subjectId],
    references: [subjects.id],
  }),
}));

export const aiConversationsRelations = relations(aiConversations, ({ one }) => ({
  user: one(users, {
    fields: [aiConversations.userId],
    references: [users.id],
  }),
  question: one(questions, {
    fields: [aiConversations.questionId],
    references: [questions.id],
  }),
}));

export const userSubjectsRelations = relations(userSubjects, ({ one }) => ({
  user: one(users, {
    fields: [userSubjects.userId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [userSubjects.subjectId],
    references: [subjects.id],
  }),
}));

export const userStatsRelations = relations(userStats, ({ one }) => ({
  user: one(users, {
    fields: [userStats.userId],
    references: [users.id],
  }),
}));
