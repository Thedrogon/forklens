"use client";

import { useState, useMemo } from "react";
import ReactFlow, { Background, Controls, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { GitFork, Clock, Zap, Layout, ArrowRight, Star } from "lucide-react";
import { getForkData } from "./action";
import ForkNode from "@/components/ForkNode";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [view, setView] = useState<"search" | "graph">("search");

  // -- NEW: State for Timeline Mode & Data Persistence --
  const [mode, setMode] = useState<"graph" | "timeline">("graph");
  const [lastData, setLastData] = useState<any>(null);
  const [lastRoot, setLastRoot] = useState<string>("");

  // Register the custom node types
  const nodeTypes = useMemo(
    () => ({
      forkNode: ForkNode,
    }),
    [],
  );

  const handleSearch = async () => {
    // Basic validation
    const cleanInput = input.replace("https://github.com/", "");
    if (!cleanInput.includes("/")) return alert("Use format: owner/repo");

    setLoading(true);
    const [owner, repo] = cleanInput.split("/");

    const result = await getForkData(owner, repo);

    if (result.success && result.data) {
      // Save data so we can toggle modes later without re-fetching
      setLastData(result.data);
      setLastRoot(`${owner}/${repo}`);

      // Process and show graph
      processGraph(result.data, `${owner}/${repo}`, mode);
      setView("graph");
    } else {
      alert("Repo not found or API limit reached!");
    }
    setLoading(false);
  };

  // -- Graph Logic --
  const processGraph = (
    data: any,
    rootName: string,
    currentMode: "graph" | "timeline",
  ) => {
    // The Center Node
    const mainNode: Node = {
      id: "root",
      type: "input",
      data: { label: rootName },
      position: { x: 0, y: 0 },
      style: {
        background: "#111",
        color: "#fff",
        border: "2px solid #000",
        fontWeight: "bold",
        width: 180,
        padding: 10,
        borderRadius: 8,
        textAlign: "center",
      },
    };

    let newNodes: Node[] = [mainNode];
    let newEdges: Edge[] = [];

    data.forks.nodes.forEach((fork: any, index: number) => {
      // Calculate freshness
      const daysAgo = Math.floor(
        (new Date().getTime() - new Date(fork.pushedAt).getTime()) /
          (1000 * 3600 * 24),
      );
      const isActive = daysAgo < 30;

      let x = 0;
      let y = 0;

      // --- LAYOUT LOGIC ---
      if (currentMode === "timeline") {
        // TIMELINE: X = Time, Y = Scatter
        // Newest forks (low daysAgo) go to the Right
        x = 600 - daysAgo * 3;

        // Scatter Y so they don't overlap
        y = (index % 2 === 0 ? -1 : 1) * (Math.random() * 400);

        // Move the root node to the far right in timeline view
        mainNode.position = { x: 700, y: 0 };
      } else {
        // SPIRAL: Standard View
        const angle = (index / (data.forks.nodes.length + 1)) * 2 * Math.PI;
        const radius = 400 + index * 10;
        x = Math.cos(angle) * radius;
        y = Math.sin(angle) * radius;

        // Reset root position
        mainNode.position = { x: 0, y: 0 };
      }

      newNodes.push({
        id: fork.nameWithOwner,
        type: "forkNode",
        data: {
          label: fork.nameWithOwner,
          avatar: fork.owner.avatarUrl,
          stars: fork.stargazerCount,
          daysAgo: daysAgo,
          url: fork.url,
        },
        position: { x, y },
        draggable: true,
      });

      newEdges.push({
        id: `e-root-${fork.nameWithOwner}`,
        source: "root",
        target: fork.nameWithOwner,
        animated: isActive,
        style: {
          stroke: isActive ? "#84cc16" : "#cbd5e1",
          strokeWidth: isActive ? 2 : 1,
        },
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  };

  // Helper to switch modes
  const toggleMode = (newMode: "graph" | "timeline") => {
    setMode(newMode);
    if (lastData && lastRoot) {
      processGraph(lastData, lastRoot, newMode);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDF4FF] font-sans text-gray-900 pt-20">
      <Navbar />

      {/* --- HERO SECTION --- */}
      {view === "search" ? (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
          <div className="w-full max-w-3xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-block bg-yellow-300 border-2 border-black px-3 py-1 rounded-full font-bold text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2 mb-4">
              ✨ New: Timeline View Added!
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1]">
              Stop Digging Through <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600">
                Dead Forks.
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Visualize repository history, identify active maintainers, and
              save your favorite diagrams. Free for open source.
            </p>

            {/* Input Box */}
            <div className="bg-white p-2 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 border-black flex gap-2 max-w-xl mx-auto transform hover:scale-[1.01] transition-transform">
              <input
                type="text"
                placeholder="facebook/react"
                className="flex-1 outline-none px-4 text-lg bg-transparent"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-[#C084FC] hover:bg-[#A855F7] text-black font-bold px-6 py-3 rounded-lg border-2 border-black transition-all active:translate-y-1 active:shadow-none disabled:opacity-50"
              >
                {loading ? "Scanning..." : "Diagram"}
              </button>
            </div>
          </div>

          <div className="absolute bottom-10 animate-bounce">
            <ArrowRight className="rotate-90 w-6 h-6 text-gray-400" />
          </div>
        </div>
      ) : (
        /* --- GRAPH VIEW --- */
        <div className="h-[calc(100vh-80px)] w-full relative bg-white border-t-2 border-black">
          {/* Back Button */}
          <button
            onClick={() => setView("search")}
            className="absolute top-5 left-5 z-20 bg-white px-4 py-2 border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all font-bold text-sm"
          >
            ← New Search
          </button>

          <button
            onClick={() => {
              // 1. Get current URL context (e.g. "facebook/react")
              const repoName = input || "facebook/react";
              // 2. Count active forks (Calculate this from your 'nodes' state)
              const activeCount = nodes.filter(
                (n) => n.data?.daysAgo < 30,
              ).length;
              const totalCount = nodes.length - 1; // Subtract root

              // 3. Generate the Markdown
              // NOTE: Replace 'your-domain.com' with your actual Vercel URL
              const markdown = `[![ForkLens](${window.location.origin}/api/og?repo=${repoName}&active=${activeCount}&total=${totalCount})](${window.location.origin}/diagram/${repoName})`;

              navigator.clipboard.writeText(markdown);
              alert("README Markdown Copied! Paste it into GitHub.");
            }}
            className="absolute top-5 right-55 z-20 bg-black text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:bg-gray-800 text-sm"
          >
            Copy README Badge
          </button>

          {/* View Toggle Buttons */}
          <div className="absolute top-5 right-5 z-20 flex bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <button
              onClick={() => toggleMode("graph")}
              className={`px-4 py-2 font-bold text-sm transition-colors ${mode === "graph" ? "bg-[#C084FC] text-black" : "hover:bg-gray-100"}`}
            >
              Graph
            </button>
            <div className="w-0.5 bg-black"></div>
            <button
              onClick={() => toggleMode("timeline")}
              className={`px-4 py-2 font-bold text-sm transition-colors ${mode === "timeline" ? "bg-[#C084FC] text-black" : "hover:bg-gray-100"}`}
            >
              Timeline
            </button>
          </div>

          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.1}
          >
            <Background color="#ccc" gap={20} />
            <Controls className="bg-white! border-2! border-black! shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]!" />
          </ReactFlow>
        </div>
      )}

      {/* --- FEATURE SECTION --- */}
      {view === "search" && (
        <section
          id="features"
          className="py-20 px-6 border-t-2 border-black bg-white"
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
              <div className="space-y-6">
                <h2 className="text-4xl font-black tracking-tight">
                  Analyze massive repos in seconds.
                </h2>
                <p className="text-lg text-gray-600">
                  See a screenshot of our visualization engine handling{" "}
                  <b>facebook/react</b>. Note how active forks are highlighted
                  in green while stale ones fade away.
                </p>
                <ul className="space-y-3 font-bold">
                  <li className="flex items-center gap-2">
                    <div className="bg-green-100 p-1 border border-black rounded">
                      <Zap size={16} />
                    </div>
                    Instant Activity Detection
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="bg-purple-100 p-1 border border-black rounded">
                      <Layout size={16} />
                    </div>
                    Smart Layout Engine
                  </li>
                </ul>
              </div>

              {/* IMAGE: Using your uploaded screenshot filename */}
              <div className="relative group">
                <div className="absolute inset-0 bg-black rounded-2xl transform translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform"></div>
                <div className="relative bg-gray-100 border-2 border-black rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
                  {/* Make sure to place the image in your public/ folder */}
                  <img
                    src="/linus_png.png"
                    alt="App Screenshot"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Timeline View",
                  icon: Clock,
                  desc: "See forks arranged by time. Who forked first? Who is maintaining it longest?",
                },
                {
                  title: "Save & Share",
                  icon: Star,
                  desc: "Logged in users can save up to 4 graphs and generate permalinks for READMEs.",
                },
                {
                  title: "Daily Quotas",
                  icon: Zap,
                  desc: "Smart rate limiting ensures fair usage. 10 deep-searches per day for free users.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="bg-[#FDF4FF] p-6 border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <feature.icon className="w-10 h-10 mb-4 text-purple-600" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
