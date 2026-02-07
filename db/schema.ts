// db/schema.ts
import { pgTable, text, timestamp, integer, uuid, boolean, jsonb } from 'drizzle-orm/pg-core';

// --- Auth Tables (Standard NextAuth) ---
export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
  // Limits
  dailySearches: integer("daily_searches").default(0),
  lastSearchReset: timestamp("last_search_reset").defaultNow(), // To reset at 12 AM
});

export const accounts = pgTable("account", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

// --- Your App Tables ---
export const savedGraphs = pgTable("saved_graphs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  repoOwner: text("repo_owner").notNull(),
  repoName: text("repo_name").notNull(),
  forkCount: integer("fork_count").default(0),
  activeCount: integer("active_count").default(0),
  // Caching
  data: jsonb("graph_data"), // We store the whole graph JSON here!
  updatedAt: timestamp("updated_at").defaultNow(), // The "2 Hour" timer
});