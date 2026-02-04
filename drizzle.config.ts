// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql", // 'pg' for older versions, 'postgresql' for newer
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});