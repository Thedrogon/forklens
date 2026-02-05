'use client'

import { useEffect, useState, useMemo } from 'react';
import ReactFlow, { Background, Controls, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import ForkNode from '@/components/ForkNode';
import { getDemoData } from '@/app/action';

export default function LandingGraph() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  
  const nodeTypes = useMemo(() => ({ forkNode: ForkNode }), []);

  useEffect(() => {
    // Fetch the cached data on mount
    const loadDemo = async () => {
      const result = await getDemoData();
      if (result.success && result.data) {
        processGraph(result.data);
      }
    };
    loadDemo();
  }, []);

  const processGraph = (data: any) => {
    // Hardcoded center for the demo
    const mainNode: Node = {
      id: 'root',
      type: 'input',
      data: { label: 'facebook/react' },
      position: { x: 0, y: 0 },
      style: { 
        background: '#111', color: '#fff', border: '2px solid #000', 
        fontWeight: 'bold', width: 180, padding: 10, borderRadius: 8, textAlign: 'center' 
      }
    };

    let newNodes: Node[] = [mainNode];
    let newEdges: Edge[] = [];

    data.forks.nodes.forEach((fork: any, index: number) => {
      const daysAgo = Math.floor((new Date().getTime() - new Date(fork.pushedAt).getTime()) / (1000 * 3600 * 24));
      const isActive = daysAgo < 30;

      // Simple Spiral Layout
      const angle = (index / (data.forks.nodes.length + 1)) * 2 * Math.PI;
      const radius = 350 + (index * 15);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      newNodes.push({
        id: fork.nameWithOwner,
        type: 'forkNode',
        data: { 
          label: fork.nameWithOwner, 
          avatar: fork.owner.avatarUrl, 
          stars: fork.stargazerCount, 
          daysAgo: daysAgo, 
          url: fork.url 
        },
        position: { x, y },
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
    <div className="w-full h-full bg-white/50 backdrop-blur-sm">
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        nodeTypes={nodeTypes} 
        fitView 
        attributionPosition="bottom-right"
        proOptions={{ hideAttribution: true }} // Optional: hides the 'ReactFlow' watermark if you have Pro
        minZoom={0.2}
      >
        <Background color="#ccc" gap={30} />
        {/* Minimal Controls for the demo */}
        <Controls showInteractive={false} className="bg-white! border-2! border-black! shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]!" />
      </ReactFlow>
      
      {/* "Live Demo" Badge Overlay */}
      <div className="absolute top-4 right-4 bg-green-100 border-2 border-green-600 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm animate-pulse">
        ● Live Interaction
      </div>
    </div>
  );
}