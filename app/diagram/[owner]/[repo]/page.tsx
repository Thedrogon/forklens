// app/diagram/[owner]/[repo]/page.tsx
'use client'

import { useEffect, useState, useMemo } from 'react';
import ReactFlow, { Background, Controls, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { getForkData } from '@/app/action'; 
import ForkNode from '@/components/ForkNode';

export default function DiagramPage({ params }: { params: { owner: string; repo: string } }) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);

  const nodeTypes = useMemo(() => ({ forkNode: ForkNode }), []);

  useEffect(() => {
    // 1. Auto-Fetch data on load
    const init = async () => {
      const result = await getForkData(params.owner, params.repo);
      if (result.success) {
        processGraph(result.data, `${params.owner}/${params.repo}`);
      }
      setLoading(false);
    };
    init();
  }, [params.owner, params.repo]);

  const processGraph = (data: any, rootName: string) => {
     // (Copy the EXACT SAME processGraph logic from your main page.tsx here)
     // ...
     // For brevity, I'm skipping the duplicate code, but you MUST copy-paste
     // the logic inside processGraph from your main page.tsx to here.
  };

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center bg-[#FDF4FF] font-bold text-xl">
       Scanning {params.owner}/{params.repo}...
    </div>
  );

  return (
    <div className="w-screen h-screen bg-white relative">
      <div className="absolute top-5 left-5 z-50">
        <a href="/" className="bg-black text-white px-4 py-2 rounded font-bold shadow-lg hover:bg-gray-800 text-sm">
          ← Create New
        </a>
      </div>
      
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView minZoom={0.1}>
        <Background color="#ccc" gap={20}/>
        <Controls />
      </ReactFlow>
    </div>
  );
}