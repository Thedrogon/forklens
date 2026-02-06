'use client';
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { GitFork, Star, Clock, ExternalLink } from 'lucide-react';

// Memoize strictly to prevent re-renders during drag
const ForkNode = ({ data }: any) => {
  return (
    <div className="relative group w-70">
      {/* PERFORMANCE OPTIMIZATION: 
         Removed heavy blur/box-shadow transitions. 
         Using simplified border logic.
      */}
      <div className={`
        bg-white border-2 border-black rounded-xl overflow-hidden
        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
        transition-transform duration-75 ease-out
        group-hover:-translate-y-1 group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
      `}>
        
        {/* Header */}
        <div className="flex items-center gap-3 p-3 border-b-2 border-black bg-gray-50/50">
          <img 
            src={data.avatar} 
            loading="lazy" // <--- Lazy load avatars
            alt="" 
            className="w-8 h-8 rounded-full border border-black bg-gray-200" 
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm truncate leading-tight">{data.label}</h3>
            <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
               {data.daysAgo} days ago
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between p-2 bg-white">
          <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 border border-black rounded-md text-xs font-bold">
            <Star size={10} className="fill-yellow-500 stroke-yellow-700" />
            {data.stars}
          </div>
          
          <a 
            href={data.url} 
            target="_blank" 
            rel="noreferrer"
            // Stop drag propagation so you can click the link without dragging the node
            onMouseDown={(e) => e.stopPropagation()} 
            className="flex items-center gap-1 text-xs font-bold text-black hover:text-purple-600 transition-colors"
          >
            Visit <ExternalLink size={10} />
          </a>
        </div>
      </div>

      {/* Handles - Keep them strictly invisible to save render time */}
      <Handle type="target" position={Position.Top} className="w-1! h-1! opacity-0!" />
      <Handle type="source" position={Position.Bottom} className="w-1! h-1! opacity-0!" />
    </div>
  );
};

// Strict comparison to prevent re-renders when parent changes
export default memo(ForkNode, (prev, next) => {
  return prev.data.label === next.data.label && prev.selected === next.selected;
});