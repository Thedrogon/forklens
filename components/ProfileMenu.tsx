'use client'
import { useState, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useClickAway } from 'react-use'; // npm install react-use (or write a hook)
import { motion, AnimatePresence } from 'framer-motion'; // Using Framer for the micro-interaction

export default function ProfileMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  
  // Close when clicking outside
  // (If you don't want to install 'react-use', just skip this line for now)
  // useClickAway(ref, () => setIsOpen(false));

  if (!session?.user) return null;

  return (
    <div className="relative" ref={ref}>
      {/* The Trigger Pill */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white/80 backdrop-blur-md border border-gray-200 pr-4 pl-1 py-1 rounded-full shadow-sm hover:shadow-md transition-all group"
      >
        <img 
          src={session.user.image || "https://github.com/ghost.png"} 
          alt="Profile" 
          className="w-8 h-8 rounded-full border border-gray-300"
        />
        <div className="flex flex-col items-start text-xs">
          <span className="font-bold text-gray-900 leading-tight">{session.user.name}</span>
          <span className="text-gray-500 font-medium">Free Plan</span>
        </div>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* The Dropdown Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-12 right-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 overflow-hidden"
          >
            <div className="px-3 py-2 border-b border-gray-100 mb-2">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Signed in as</p>
               <p className="text-sm font-bold truncate">{session.user.email}</p>
            </div>

            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors">
               <User size={16} /> Profile
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors">
               <Settings size={16} /> Settings
            </button>
            
            <div className="h-px bg-gray-100 my-2" />
            
            <button 
              onClick={() => signOut()}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
               <LogOut size={16} /> Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}