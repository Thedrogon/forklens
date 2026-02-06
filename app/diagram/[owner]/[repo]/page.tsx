"use client";

import { useState, useEffect, useMemo, use } from "react";
import ReactFlow, { Background, Controls, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { useRouter } from "next/navigation";
import { Save, Share2, ArrowLeft, Loader2, GitFork } from "lucide-react";
import ForkNode from "@/components/ForkNode";
import ProfileMenu from "@/components/ProfileMenu"; // <--- USE THIS, NOT NAVBAR
import Link from "next/link";
import { getForkData, saveGraph } from "@/app/action";

// ... processGraph helper function remains exactly the same ...
// Inside app/diagram/[owner]/[repo]/page.tsx



const processGraph = (data: any, rootName: string, currentMode: 'graph' | 'timeline') => {
  if (!data || !data.forks) return { nodes: [], edges: [] };

  const mainNode: Node = {
    id: 'root',
    type: 'input', 
    data: { label: rootName },
    position: { x: 0, y: 0 },
    style: { 
      background: '#111', 
      color: '#fff', 
      border: '3px solid #000',
      fontWeight: '900', 
      // FIX 1: Auto width to fit long names
      width: 'auto',
      minWidth: 250, 
      padding: '15px 30px', // More padding
      borderRadius: 50, 
      textAlign: 'center', 
      fontSize: '18px', 
      boxShadow: '8px 8px 0px 0px rgba(0,0,0,0.2)',
      zIndex: 50
    }
  };

  let newNodes: Node[] = [mainNode];
  let newEdges: Edge[] = [];

  const forks = data.forks.nodes;
  const GOLDEN_ANGLE = 137.5 * (Math.PI / 180); 
  
  // FIX 2: Reduced from 280 to 180 (Much tighter packing)
  const SPREAD_FACTOR = 190; 

  forks.forEach((fork: any, index: number) => {
    const daysAgo = Math.floor((new Date().getTime() - new Date(fork.pushedAt).getTime()) / (1000 * 3600 * 24));
    const isActive = daysAgo < 30; 
    let x = 0, y = 0;

    if (currentMode === 'timeline') {
      x = 800 - (daysAgo * 5); 
      y = (index % 2 === 0 ? -1 : 1) * (Math.random() * 600); 
      mainNode.position = { x: 900, y: 0 };
    } else {
      // Golden Angle Spiral
      const r = SPREAD_FACTOR * Math.sqrt(index + 1);
      const theta = index * GOLDEN_ANGLE;
      
      x = r * Math.cos(theta);
      y = r * Math.sin(theta);
    }

    newNodes.push({
      id: fork.nameWithOwner,
      type: 'forkNode',
      data: { 
        label: fork.nameWithOwner, avatar: fork.owner.avatarUrl,
        stars: fork.stargazerCount, daysAgo: daysAgo, url: fork.url
      },
      position: { x, y },
      draggable: true,
      style: { zIndex: 20 } 
    });

    newEdges.push({
      id: `e-root-${fork.nameWithOwner}`,
      source: 'root',
      target: fork.nameWithOwner,
      animated: isActive,
      style: { 
        stroke: isActive ? '#C084FC' : '#cbd5e1', 
        strokeWidth: isActive ? 3 : 1.5,
      }
    });
  });

  return { nodes: newNodes, edges: newEdges };
};


const nodeTypes = {
  forkNode: ForkNode,
};

export default function DiagramPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = use(params);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [mode, setMode] = useState<"graph" | "timeline">("graph");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rawRepoData, setRawRepoData] = useState<any>(null);

  const router = useRouter();
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getForkData(owner, repo);

      if (result.success && result.data) {
        setRawRepoData(result.data);
        const { nodes: n, edges: e } = processGraph(
          result.data,
          `${owner}/${repo}`,
          mode,
        );
        setNodes(n);
        setEdges(e);
      } else {
        alert(result.error || "Repo not found");
        router.push("/dashboard");
      }
      setLoading(false);
    };

    fetchData();
  }, [owner, repo, mode, router]);

  const handleSave = async () => {
    if (saving || !rawRepoData) return;
    setSaving(true);
    const result = await saveGraph(owner, repo, rawRepoData);
    if (result.success) {
      alert("Graph Saved to Dashboard!");
    } else {
      alert(result.error);
    }
    setSaving(false);
  };

  const handleShare = () => {
    // 1. Calculate stats from your existing 'nodes' state
    const totalCount = nodes.filter((n) => n.type === "forkNode").length;
    const activeCount = nodes.filter(
      (n) => n.type === "forkNode" && n.data.daysAgo < 30,
    ).length;

    // 2. Build the URL with params
    // Note: We use window.location.origin to get the current domain (localhost or production)
    const imageUrl = `${window.location.origin}/api/og?repo=${owner}/${repo}&active=${activeCount}&total=${totalCount}`;
    const linkUrl = window.location.href;

    // 3. Create the Markdown
    const markdown = `[![ForkLens Graph](${imageUrl})](${linkUrl})`;

    navigator.clipboard.writeText(markdown);
    alert(
      "Markdown copied! (Note: Images won't show on GitHub until you deploy this app to the web)",
    );
  };

  return (
    <div className="h-screen w-full bg-[#FDF4FF] flex flex-col font-sans">
      {/* --- REPLACED NAVBAR WITH DASHBOARD HEADER --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-black h-20 flex items-center justify-between px-6">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="bg-purple-600 p-1.5 rounded-lg border-2 border-black group-hover:translate-y-0.5 transition-transform">
            <GitFork className="text-white w-5 h-5" />
          </div>
          <span className="text-2xl font-black tracking-tight text-black">
            ForkLens
          </span>
        </Link>
        {/* Using ProfileMenu makes it look exactly like the dashboard */}
        <ProfileMenu />
      </nav>

      {/* Main Content Area */}
      <div className="grow relative bg-white border-t-2 border-black mt-20">
        {/* Back Button */}
        <div className="absolute top-6 left-6 z-20">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-white px-4 py-2 border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-sm hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </div>

        {/* Controls */}
        <div className="absolute top-6 right-6 z-20 flex gap-4">
          <div className="flex bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden h-10">
            <button
              onClick={() => setMode("graph")}
              className={`px-4 font-bold text-sm transition-colors ${mode === "graph" ? "bg-[#C084FC] text-black" : "hover:bg-gray-100"}`}
            >
              Graph
            </button>
            <div className="w-0.5 bg-black"></div>
            <button
              onClick={() => setMode("timeline")}
              className={`px-4 font-bold text-sm transition-colors ${mode === "timeline" ? "bg-[#C084FC] text-black" : "hover:bg-gray-100"}`}
            >
              Timeline
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="h-10 px-4 bg-black text-white font-bold text-sm rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2 border-2 border-black active:translate-y-1"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Save size={16} />
            )}
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            onClick={handleShare}
            className="h-10 px-4 bg-white text-black font-bold text-sm rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2 border-2 border-black"
          >
            <Share2 size={16} /> Share
          </button>
        </div>

        {/* Graph Render */}
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50 backdrop-blur-sm">
            <Loader2 className="animate-spin text-purple-600 w-12 h-12" />
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.1}
          >
            <Background color="#eee" gap={20} size={2} />
            <Controls className="bg-white! border-2! border-black! shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]! m-4!" />
          </ReactFlow>
        )}
      </div>
    </div>
  );
}
