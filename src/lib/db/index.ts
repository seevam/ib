import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Use a placeholder during build time, actual validation happens at runtime
const databaseUrl = process.env.DATABASE_URL || 'postgresql://placeholder';

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
