import OpenAI from 'openai';

// Use a placeholder during build time, actual validation happens at runtime
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder',
});
