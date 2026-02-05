import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db"; // Ensure this path is correct
import { users, savedGraphs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Navbar from "@/components/Navbar";
import ProfileMenu from "@/components/ProfileMenu"; // We'll inject this via Navbar or render manually
import DashboardSearch from "@/components/DashboardSearch";
import { Trash2, ExternalLink, RefreshCw, GitFork } from "lucide-react";
import Link from "next/link";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) redirect("/");

  const userEmail = session.user.email || "";

  // 1. Get User Data (Limits)
  // We need the user's ID from DB to fetch their graphs
  const dbUser = await db.query.users.findFirst({
    where: eq(users.email, userEmail),
  });

  if (!dbUser) redirect("/"); // Should not happen if logged in

  // 2. Reset Daily Limit logic (Simple Check)
  const today = new Date().toDateString();
  const lastReset = dbUser.lastSearchReset
    ? new Date(dbUser.lastSearchReset).toDateString()
    : "";

  if (today !== lastReset) {
    // It's a new day! Reset counters (Server Action or inline DB call)
    await db
      .update(users)
      .set({ dailySearches: 0, lastSearchReset: new Date() })
      .where(eq(users.id, dbUser.id));
    dbUser.dailySearches = 0; // Optimistic update for UI
  }

  // 3. Fetch Saved Graphs
  const myGraphs = await db.query.savedGraphs.findMany({
    where: eq(savedGraphs.userId, dbUser.id),
    orderBy: [desc(savedGraphs.updatedAt)],
    limit: 4, // Max 4
  });

  return (
    <div className="min-h-screen bg-[#FDF4FF] pb-20">
      {/* Custom Navbar Injection for Dashboard */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md h-16 flex items-center justify-between px-6 shadow-sm">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <GitFork className="text-purple-600" /> ForkLens
        </Link>
        <ProfileMenu />
      </nav>

      <div className="pt-24 max-w-5xl mx-auto px-6 space-y-12">
        {/* SECTION 1: SEARCH HUD */}
        <section>
          <DashboardSearch usageCount={dbUser.dailySearches || 0} />
        </section>

        {/* SECTION 2: SAVED GRAPHS */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
              <span className="w-2 h-8 bg-purple-600 rounded-full" />
              Saved Diagrams
            </h3>
            <span className="text-xs font-bold bg-white px-3 py-1 rounded-full border border-gray-200 text-gray-500">
              {myGraphs.length} / 4 Slots Used
            </span>
          </div>

          {myGraphs.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-2xl">
              <p className="text-gray-400 font-bold">No saved graphs yet.</p>
              <p className="text-sm text-gray-400">
                Search above to create one.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {myGraphs.map((graph) => {
                const isStale =
                  new Date().getTime() - new Date(graph.updatedAt!).getTime() >
                  1000 * 60 * 60 * 2; // > 2 hours

                return (
                  <div
                    key={graph.id}
                    className="group bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Status Dot */}
                    <div
                      className={`absolute top-4 right-4 w-2 h-2 rounded-full ${isStale ? "bg-yellow-400" : "bg-green-500"}`}
                      title={isStale ? "Update pending" : "Live"}
                    />

                    <div className="mb-4">
                      <h4 className="text-lg font-bold text-gray-900 leading-none mb-1">
                        {graph.repoOwner} / {graph.repoName}
                      </h4>
                      <p className="text-xs text-gray-400">
                        Updated{" "}
                        {new Date(graph.updatedAt!).toLocaleTimeString()}
                      </p>
                    </div>

                    <div className="flex gap-4 text-sm font-medium text-gray-600 mb-6">
                      <div className="bg-purple-50 px-3 py-1 rounded-lg text-purple-700">
                        {graph.activeCount} Active
                      </div>
                      <div className="bg-gray-100 px-3 py-1 rounded-lg">
                        {graph.forkCount} Forks
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        href={`/diagram/${graph.repoOwner}/${graph.repoName}`}
                        className="flex-1 bg-black text-white text-center py-2 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors"
                      >
                        Open Graph
                      </Link>

                      {/* Delete Button (You'll need a server action for this) */}
                      <form
                        action={async () => {
                          "use server";
                          await db
                            .delete(savedGraphs)
                            .where(eq(savedGraphs.id, graph.id));
                          // revalidatePath('/dashboard')
                        }}
                      >
                        <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
