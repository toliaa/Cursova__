import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';

const { Pool } = pg;

// For serverless environments like Vercel, we want to create a new connection for each request
// rather than reusing a connection pool which can lead to connection issues
let dbInstance: ReturnType<typeof drizzle>;

// Create a connection function that returns a drizzle instance
export function getDb() {
  if (dbInstance) return dbInstance;
  
  // Create a new connection for each request in serverless environments
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    // Set max connections to 1 for serverless environments
    max: process.env.NODE_ENV === 'production' ? 1 : 10,
    // Set idle timeout lower for serverless 
    idleTimeoutMillis: process.env.NODE_ENV === 'production' ? 1000 : 30000,
  });

  // Create a drizzle instance
  dbInstance = drizzle(pool, { schema });
  return dbInstance;
}

// For backwards compatibility with existing code
export const db = getDb();