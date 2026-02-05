import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db"; 
import { users, savedGraphs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache"; // <--- Don't forget this!
import ProfileMenu from "@/components/ProfileMenu"; 
import DashboardSearch from "@/components/DashboardSearch";
import { Trash2, GitFork, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const userEmail = session.user.email || "";

  const dbUser = await db.query.users.findFirst({
    where: eq(users.email, userEmail),
  });

  if (!dbUser) redirect("/");

  // Reset Daily Limit Logic
  const today = new Date().toDateString();
  const lastReset = dbUser.lastSearchReset ? new Date(dbUser.lastSearchReset).toDateString() : "";

  if (today !== lastReset) {
    await db.update(users).set({ dailySearches: 0, lastSearchReset: new Date() }).where(eq(users.id, dbUser.id));
    dbUser.dailySearches = 0; 
  }

  const myGraphs = await db.query.savedGraphs.findMany({
    where: eq(savedGraphs.userId, dbUser.id),
    orderBy: [desc(savedGraphs.updatedAt)],
    limit: 4, 
  });

  return (
    <div className="min-h-screen bg-[#FDF4FF] pb-20 font-sans">
      {/* Brutalist Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-black h-20 flex items-center justify-between px-6">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="bg-purple-600 p-1.5 rounded-lg border-2 border-black group-hover:translate-y-0.5 transition-transform">
             <GitFork className="text-white w-5 h-5" />
          </div>
          <span className="text-2xl font-black tracking-tight text-black">ForkLens</span>
        </Link>
        <ProfileMenu />
      </nav>

      <div className="pt-32 max-w-5xl mx-auto px-6 space-y-12">
        
        {/* Search Section */}
        <section>
          <DashboardSearch usageCount={dbUser.dailySearches || 0} />
        </section>

        {/* Saved Graphs Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black tracking-tight flex items-center gap-3 uppercase">
              <span className="w-4 h-8 bg-purple-600 border-2 border-black -skew-x-12" />
              Saved Diagrams
            </h3>
            <div className="text-xs font-black bg-white px-4 py-2 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {myGraphs.length} / 4 SLOTS
            </div>
          </div>

          {myGraphs.length === 0 ? (
            <div className="text-center py-24 bg-white border-2 border-black border-dashed rounded-xl opacity-60">
              <p className="text-xl font-black text-gray-400 uppercase">No saved graphs yet.</p>
              <p className="text-sm font-bold text-gray-400 mt-2">Search above to create your first one.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {myGraphs.map((graph) => {
                const isStale = (new Date().getTime() - new Date(graph.updatedAt!).getTime()) > (1000 * 60 * 60 * 2); 

                return (
                  <div key={graph.id} className="relative group bg-white rounded-xl border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
                    
                    {/* Status Badge */}
                    <div className={`absolute -top-3 -right-3 px-3 py-1 border-2 border-black text-xs font-black uppercase tracking-wider rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isStale ? 'bg-yellow-300 text-black' : 'bg-green-400 text-black'}`}>
                      {isStale ? "Update Pending" : "Live"}
                    </div>

                    <div className="mb-6 mt-2">
                      <h4 className="text-2xl font-black text-black leading-none mb-2 break-all">
                        {graph.repoOwner} / <br/> {graph.repoName}
                      </h4>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                        Updated {new Date(graph.updatedAt!).toLocaleTimeString()}
                      </p>
                    </div>

                    <div className="flex gap-3 text-sm font-bold mb-6">
                      <div className="bg-purple-100 border-2 border-black px-3 py-1 rounded-md text-purple-900">
                        {graph.activeCount} Active
                      </div>
                      <div className="bg-gray-100 border-2 border-black px-3 py-1 rounded-md text-gray-700">
                        {graph.forkCount} Forks
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link 
                        href={`/diagram/${graph.repoOwner}/${graph.repoName}`}
                        className="flex-1 bg-black text-white text-center py-3 rounded-lg font-black text-sm border-2 border-black hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                      >
                        OPEN GRAPH <ArrowUpRight size={16} />
                      </Link>
                      
                      <form action={async () => {
                        'use server';
                        await db.delete(savedGraphs).where(eq(savedGraphs.id, graph.id));
                        revalidatePath('/dashboard');
                      }}>
                        <button className="h-full px-4 text-black bg-white hover:bg-red-50 hover:text-red-600 border-2 border-black rounded-lg transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none">
                          <Trash2 size={20} />
                        </button>
                      </form>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}