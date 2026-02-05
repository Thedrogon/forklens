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
    // Redirect to the permalink page which handles the fetching & saving logic
    router.push(`/diagram/${input}`);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-lg p-6 relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />

      <h2 className="text-2xl font-black mb-1">Quick Analyze</h2>
      <p className="text-gray-500 text-sm mb-6">Enter a GitHub repository to generate a fresh graph.</p>

      {/* Usage Bar */}
      <div className="flex justify-between text-xs font-bold text-gray-400 mb-1">
        <span>Daily Quota</span>
        <span className={isLocked ? "text-red-500" : "text-purple-600"}>{usageCount}/{limit}</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${isLocked ? 'bg-red-500' : 'bg-purple-600'}`} 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            disabled={isLocked || loading}
            placeholder={isLocked ? "Daily limit reached" : "owner/repo"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-purple-600 focus:bg-white transition-all disabled:opacity-50"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isLocked || loading}
          className={`px-6 py-3 rounded-xl font-bold text-white transition-all flex items-center gap-2 ${
            isLocked 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-black hover:bg-gray-800 active:scale-95 shadow-lg hover:shadow-xl'
          }`}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : (isLocked ? <Lock size={20}/> : "Diagram")}
        </button>
      </div>
    </div>
  );
}