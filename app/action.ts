'use server'
import { unstable_cache } from "next/cache";
import { Octokit } from "octokit";
import { db } from "@/db"; 
import { users, savedGraphs } from "@/db/schema";
import { auth } from "@/auth"; 
import { eq, and } from "drizzle-orm";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

// --- 1. PRIVATE HELPER (Safe for Cache) ---
// This function ONLY talks to GitHub. No Auth, No DB.
async function fetchRawGithubData(owner: string, repo: string) {
  console.log(`🌍 Querying GitHub for ${owner}/${repo}...`);
  const query = `
    query ($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        forkCount
        forks(first: 20, orderBy: {field: STARGAZERS, direction: DESC}) {
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
    return { success: false, error: "Repo not found" };
  }
}

// --- 2. PUBLIC ACTION (For Users) ---
// This handles Auth, Rate Limits, and DB Saving
export async function getForkData(owner: string, repo: string) {
  const session = await auth();
  const userEmail = session?.user?.email;
  let dbUser = null;

  // A. RATE LIMIT CHECK
  if (userEmail) {
    dbUser = await db.query.users.findFirst({
      where: eq(users.email, userEmail),
    });

    if (dbUser) {
      if ((dbUser.dailySearches || 0) >= 10) {
        return { success: false, error: "Daily limit reached (10/10).", data:null};
      }
      // Increment count
      await db.update(users)
        .set({ dailySearches: (dbUser.dailySearches || 0) + 1 })
        .where(eq(users.id, dbUser.id));
    }
  }

  // B. CACHE CHECK (DB)
  let existingGraph = null;
  if (dbUser) {
    existingGraph = await db.query.savedGraphs.findFirst({
      where: and(
        eq(savedGraphs.userId, dbUser.id),
        eq(savedGraphs.repoOwner, owner),
        eq(savedGraphs.repoName, repo)
      )
    });

    if (existingGraph && existingGraph.updatedAt) {
      const hours = (new Date().getTime() - new Date(existingGraph.updatedAt).getTime()) / 3600000;
      if (hours < 2 && existingGraph.data) {
        console.log("⚡ DB CACHE HIT");
        return { success: true, data: existingGraph.data };
      }
    }
  }

  // C. FETCH REAL DATA (Using the helper)
  const result = await fetchRawGithubData(owner, repo);
  
  if (!result.success) return result;

  // D. SAVE TO DB
  if (dbUser && result.data) {
    const activeCount = result.data.forks.nodes.filter((n: any) => {
      const days = (new Date().getTime() - new Date(n.pushedAt).getTime()) / 86400000;
      return days < 30;
    }).length;

    if (existingGraph) {
      await db.update(savedGraphs).set({
        data: result.data,
        forkCount: result.data.forkCount,
        activeCount: activeCount,
        updatedAt: new Date(),
      }).where(eq(savedGraphs.id, existingGraph.id));
    } else {
      await db.insert(savedGraphs).values({
        userId: dbUser.id,
        repoOwner: owner,
        repoName: repo,
        forkCount: result.data.forkCount,
        activeCount: activeCount,
        data: result.data,
      });
    }
  }

  return result;
}

// --- 3. DEMO DATA (Cached Static Version) ---
// This now calls the PRIVATE helper, avoiding auth() calls entirely.
export const getDemoData = unstable_cache(
  async () => {
    console.log("⚡ RE-FETCHING DEMO DATA");
    // Call the safe helper, NOT the main action
    return await fetchRawGithubData('shadcn-ui', 'ui');
  },
  ['demo-data-v1'], 
  { revalidate: 864000 } 
);