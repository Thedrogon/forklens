import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "./schema"; // <--- IMPORT YOUR SCHEMA

const sql = neon(process.env.DATABASE_URL!);

// Pass the schema here so 'db.query.users' works!
export const db = drizzle(sql, { schema });