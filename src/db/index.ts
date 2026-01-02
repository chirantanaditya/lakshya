import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Get database URL from environment
// Keep Neon credentials secure: do not expose them to client-side code
function getDatabaseUrl(): string {
  // Try process.env first (Node.js), then import.meta.env (Astro)
  const url = process.env.DATABASE_URL || import.meta.env.DATABASE_URL;
  
  if (!url) {
    throw new Error(
      'DATABASE_URL environment variable is not set. ' +
      'Please set it in your .env file. ' +
      'Keep Neon credentials secure: do not expose them to client-side code.'
    );
  }
  
  return url;
}

// Create database connection
// This should only be used server-side
const sql = neon(getDatabaseUrl());
export const db = drizzle(sql, { schema });

// Verify connection on import (optional, can be removed if too slow)
if (import.meta.env.DEV) {
  console.log('✅ Database connection initialized');
}

