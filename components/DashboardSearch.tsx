'use client'
import { useState } from 'react';
import { Search, Loader2, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardSearch({ usageCount }: { usageCount: number }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const limit = 10;
  const isLocked = usageCount >= limit;
  const progress = (usageCount / limit) * 100;

  const handleSearch = () => {
    if (isLocked) return;
    if (!input.includes('/')) return alert("Use owner/repo format");
    
    setLoading(true);
    router.push(`/diagram/${input}`);
  };

  return (
    <div className="w-full bg-white rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative overflow-hidden">
      
      <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-black uppercase">Quick Analyze</h2>
          <p className="text-gray-600 font-bold text-sm">Generate a fresh graph immediately.</p>
        </div>
        
        {/* Brutalist Progress Bar */}
        <div className="w-full md:w-64">
          <div className="flex justify-between text-xs font-black uppercase tracking-wider mb-1">
            <span>Daily Quota</span>
            <span className={isLocked ? "text-red-600" : "text-purple-600"}>{usageCount}/{limit}</span>
          </div>
          <div className="w-full h-4 bg-gray-200 border-2 border-black rounded-full overflow-hidden">
            <div 
              className={`h-full border-r-2 border-black transition-all duration-500 ${isLocked ? 'bg-red-500' : 'bg-purple-500'}`} 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} />
          <input
            type="text"
            disabled={isLocked || loading}
            placeholder={isLocked ? "DAILY LIMIT REACHED" : "facebook/react"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-black rounded-lg outline-none font-bold text-lg placeholder:text-gray-400 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-0.5 transition-all disabled:opacity-50 disabled:bg-gray-100"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isLocked || loading}
          className={`px-8 py-4 rounded-lg font-black text-white border-2 border-black transition-all flex items-center justify-center gap-2 ${
            isLocked 
              ? 'bg-gray-400 cursor-not-allowed shadow-none' 
              : 'bg-[#C084FC] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none'
          }`}
        >
          {loading ? <Loader2 className="animate-spin" size={24} /> : (isLocked ? <Lock size={24}/> : "DIAGRAM")}
        </button>
      </div>
    </div>
  );
}