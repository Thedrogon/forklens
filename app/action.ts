'use server'
import { Octokit } from "octokit";
import { db } from "@/db"; 
import { users, savedGraphs } from "@/db/schema";
import { auth } from "@/auth"; 
import { eq, and } from "drizzle-orm";
import { revalidatePath, unstable_cache } from "next/cache";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const DAILY_LIMIT = 50; // <--- NEW LIMIT

// --- 1. PRIVATE HELPER ---
async function fetchRawGithubData(owner: string, repo: string) {
  console.log(`🌍 Querying GitHub for ${owner}/${repo}...`);
  const query = `
    query ($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        forkCount
        forks(first: 50, orderBy: {field: STARGAZERS, direction: DESC}) {
          nodes {
            nameWithOwner
            stargazerCount
            pushedAt
            url
            owner { login avatarUrl }
          }
        }
      }
    }
  `;
  try {
    const data: any = await octokit.graphql(query, { owner, name: repo });
    return { success: true, data: data.repository };
  } catch (error) {
    console.error("GitHub Error:", error);
    return { success: false, error: "Repo not found", data: null };
  }
}

// --- 2. SMART SEARCH ACTION ---
export async function getForkData(owner: string, repo: string) {
  const session = await auth();
  const userEmail = session?.user?.email;

  if (userEmail) {
    let dbUser = await db.query.users.findFirst({
      where: eq(users.email, userEmail),
    });

    if (dbUser) {
      // A. CHECK SAVED GRAPHS FIRST (Free Pass)
      const savedGraph = await db.query.savedGraphs.findFirst({
        where: and(
          eq(savedGraphs.userId, dbUser.id),
          eq(savedGraphs.repoOwner, owner),
          eq(savedGraphs.repoName, repo)
        )
      });

      if (savedGraph && savedGraph.data) {
        console.log("⚡ Serving from DB Cache (No Quota Used)");
        return { success: true, data: savedGraph.data };
      }

      // B. LAZY RESET LOGIC (New Day Check)
      const today = new Date().toDateString();
      const lastReset = dbUser.lastSearchReset ? new Date(dbUser.lastSearchReset).toDateString() : "";

      if (today !== lastReset) {
        console.log("🔄 New day detected! Resetting limit...");
        // Reset DB immediately
        await db.update(users)
          .set({ dailySearches: 0, lastSearchReset: new Date() })
          .where(eq(users.id, dbUser.id));
        
        // Update local variable so the rest of the function knows we are fresh
        dbUser.dailySearches = 0; 
      }

      // C. RATE LIMIT CHECK (Now 50)
      if ((dbUser.dailySearches || 0) >= DAILY_LIMIT) {
        return { success: false, error: `Daily limit reached (${DAILY_LIMIT}/${DAILY_LIMIT}).`, data: null };
      }

      // Increment count
      await db.update(users)
        .set({ dailySearches: (dbUser.dailySearches || 0) + 1 })
        .where(eq(users.id, dbUser.id));
    }
  }

  // D. FETCH REAL DATA
  return await fetchRawGithubData(owner, repo);
}

// --- 3. SAVE ACTION ---
export async function saveGraph(owner: string, repo: string, data: any) {
  const session = await auth();
  if (!session?.user?.email) return { success: false, error: "Not logged in" };

  const dbUser = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!dbUser) return { success: false, error: "User not found" };

  const existingGraphs = await db.query.savedGraphs.findMany({
    where: eq(savedGraphs.userId, dbUser.id)
  });

  if (existingGraphs.length >= 4) {
    return { success: false, error: "Slot limit reached (4/4). Delete one to save this." };
  }

  const alreadySaved = existingGraphs.find(g => g.repoOwner === owner && g.repoName === repo);
  if (alreadySaved) {
     return { success: false, error: "Already saved!" };
  }

  const activeCount = data.forks.nodes.filter((n: any) => {
    const days = (new Date().getTime() - new Date(n.pushedAt).getTime()) / 86400000;
    return days < 30;
  }).length;

  await db.insert(savedGraphs).values({
    userId: dbUser.id,
    repoOwner: owner,
    repoName: repo,
    forkCount: data.forkCount,
    activeCount: activeCount,
    data: data, 
  });

  revalidatePath('/dashboard');
  return { success: true };
}

// --- 4. LANDING PAGE DEMO ---
export const getDemoData = unstable_cache(
  async () => {
    return await fetchRawGithubData('facebook', 'react');
  },
  ['demo-data-v1'], 
  { revalidate: 864000 } 
);