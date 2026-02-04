'use server'
import { Octokit } from "octokit";
// import { db } from "@/db";                <-- COMMENT OUT
// import { searches } from "@/db/schema";    <-- COMMENT OUT

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function getForkData(owner: string, repo: string) {
  console.log(`1. Starting search for ${owner}/${repo}`); // <--- Add Debug Log

  // --- COMMENT THIS BLOCK OUT ---
  /*
  try {
    await db.insert(searches).values({ owner, repo });
  } catch (e) {
    console.log("DB Log failed", e);
  }
  */
  // -----------------------------

  console.log("2. Querying GitHub..."); // <--- Add Debug Log

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
    console.log("3. GitHub replied!"); // <--- Add Debug Log
    return { success: true, data: data.repository };
  } catch (error) {
    console.error("GitHub Error:", error);
    return { success: false, error: "Repo not found or API limit reached" };
  }
}