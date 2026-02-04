// components/ForkNode.tsx
'use client';
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { GitFork, Star, Clock } from 'lucide-react';

const ForkNode = ({ data }: any) => {
  return (
    <div className="w-70 bg-white border-2 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden font-sans transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      
      {/* Header with Avatar */}
      <div className="flex items-center gap-3 p-3 border-b-2 border-black bg-gray-50">
        <img 
          src={data.avatar} 
          alt="avatar" 
          className="w-10 h-10 rounded-full border border-black" 
        />
        <div className="overflow-hidden">
          <h3 className="font-bold text-sm truncate">{data.label}</h3>
          <a 
            href={data.url} 
            target="_blank" 
            rel="noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            View Repo ↗
          </a>
        </div>
      </div>

      {/* Stats Row */}
      <div className="p-3 grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-1 text-yellow-600 font-bold">
          <Star size={16} fill="currentColor" />
          <span>{data.stars}</span>
        </div>
        
        <div className={`flex items-center gap-1 font-bold ${data.daysAgo < 30 ? 'text-green-600' : 'text-gray-400'}`}>
          <Clock size={16} />
          <span>{data.daysAgo}d ago</span>
        </div>
      </div>

      {/* React Flow Connection Handles */}
      <Handle type="target" position={Position.Top} className="bg-black! w-3! h-3!" />
      <Handle type="source" position={Position.Bottom} className="bg-black! w-3! h-3!" />
    </div>
  );
};

export default memo(ForkNode);