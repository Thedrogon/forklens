'use client'

import { useState, useEffect, useMemo } from 'react';
import ReactFlow, { Background, Controls, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import ForkNode from '@/components/ForkNode';
import Navbar from '@/components/Navbar'; // We will reuse the Navbar
import { useRouter } from 'next/navigation';

export default function GraphView({ initialData, repoName }: { initialData: any, repoName: string }) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [mode, setMode] = useState<'graph' | 'timeline'>('graph');

  const nodeTypes = useMemo(() => ({ forkNode: ForkNode }), []);
  const router = useRouter();

  // Process data on load
  useEffect(() => {
    if (initialData) {
      processGraph(initialData, repoName, mode);
    }
  }, [initialData, mode, repoName]);

  const processGraph = (data: any, rootName: string, currentMode: 'graph' | 'timeline') => {
    const mainNode: Node = {
      id: 'root',
      type: 'input', 
      data: { label: rootName },
      position: { x: 0, y: 0 },
      style: { 
        background: '#111', color: '#fff', border: '2px solid #000',
        fontWeight: 'bold', width: 180, padding: 10, borderRadius: 8, textAlign: 'center'
      }
    };

    let newNodes: Node[] = [mainNode];
    let newEdges: Edge[] = [];

    // Safety check for empty data
    if (!data.forks || !data.forks.nodes) return;

    data.forks.nodes.forEach((fork: any, index: number) => {
      const daysAgo = Math.floor((new Date().getTime() - new Date(fork.pushedAt).getTime()) / (1000 * 3600 * 24));
      const isActive = daysAgo < 30; 
      let x = 0, y = 0;

      if (currentMode === 'timeline') {
        x = 600 - (daysAgo * 3); 
        y = (index % 2 === 0 ? -1 : 1) * (Math.random() * 400); 
        mainNode.position = { x: 700, y: 0 };
      } else {
        const angle = (index / (data.forks.nodes.length + 1)) * 2 * Math.PI;
        const radius = 400 + (index * 10); 
        x = Math.cos(angle) * radius; 
        y = Math.sin(angle) * radius;
        mainNode.position = { x: 0, y: 0 };
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
      });

      newEdges.push({
        id: `e-root-${fork.nameWithOwner}`,
        source: 'root',
        target: fork.nameWithOwner,
        animated: isActive,
        style: { stroke: isActive ? '#84cc16' : '#cbd5e1', strokeWidth: isActive ? 2 : 1 }
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  };

  return (
    <div className="h-screen w-full bg-[#FDF4FF] flex flex-col">
      {/* Reusing Navbar for consistency */}
      <Navbar />

      <div className="grow relative bg-white border-t-2 border-black">
        
        {/* Floating Controls */}
        <div className="absolute top-24 left-6 z-20 flex gap-4">
           <button 
             onClick={() => router.push('/dashboard')}
             className="bg-white px-4 py-2 border-2 border-black rounded-lg shadow-md font-bold text-sm hover:translate-y-1 hover:shadow-none transition-all"
           >
             ← Back to Dashboard
           </button>
        </div>

        <div className="absolute top-24 right-6 z-20 flex bg-white border-2 border-black rounded-lg shadow-md overflow-hidden">
             <button onClick={() => setMode('graph')} className={`px-4 py-2 font-bold text-sm transition-colors ${mode === 'graph' ? 'bg-[#C084FC] text-black' : 'hover:bg-gray-100'}`}>Graph</button>
             <div className="w-0.5 bg-black"></div>
             <button onClick={() => setMode('timeline')} className={`px-4 py-2 font-bold text-sm transition-colors ${mode === 'timeline' ? 'bg-[#C084FC] text-black' : 'hover:bg-gray-100'}`}>Timeline</button>
        </div>

        <ReactFlow 
          nodes={nodes} 
          edges={edges} 
          nodeTypes={nodeTypes} 
          fitView
          minZoom={0.1}
        >
          <Background color="#ccc" gap={20} />
          <Controls className="bg-white! border-2! border-black! shadow-md!" />
        </ReactFlow>
      </div>
    </div>
  );
}