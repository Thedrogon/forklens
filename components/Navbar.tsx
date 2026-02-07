'use client'
import Link from 'next/link';
import { GitFork, Github, LogIn, Star } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import LoginModal from './LoginModal';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = (window.innerHeight * 0.85) - 80; 
      setIsScrolled(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-center px-6 lg:px-15 transition-all duration-500 overflow-hidden
        ${isScrolled 
          ? 'bg-[#1E1B4B]/70 backdrop-blur-md shadow-lg border-b border-white/10' 
          : 'bg-[#1E1B4B] shadow-none border-b-0'
        }`}
      >
        {/* --- 1. THE DOT PATTERN --- */}
        {/* pointer-events-none: Ensures clicks pass through to the buttons */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}
        />

        {/* --- 2. THE CONTENT (Must be Z-10 to sit above dots) --- */}
        <div className='max-w-6xl w-full flex items-center justify-between h-full relative z-10'>
        
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-[#C084FC] p-1.5 rounded-lg border-2 border-white group-hover:translate-y-0.5 transition-transform">
              <GitFork className="text-black w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">ForkLens</span>
          </Link>

          <div className="hidden md:flex gap-6 font-bold text-[16px] text-white/90">
            <Link href="#features" className="hover:text-[#FACC15]  transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-[#FACC15]  transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/thedrogon/forklens" 
              target="_blank"
              className="hidden sm:flex items-center gap-2 bg-white text-black px-3 py-1.5 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] hover:translate-y-0.5 hover:shadow-none transition-all text-xs font-bold"
            >
              <Github className="w-4 h-4" />
              <span>Star us</span>
              <div className="w-px h-4 bg-gray-300 mx-1" />
              <div className="flex items-center gap-1 text-yellow-600">
                <Star className="w-3 h-3 fill-current" />
                <span>124</span>
              </div>
            </a>

            {session ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="font-bold text-white hover:text-[#FACC15] transition-colors">
                  My Graphs
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="bg-black text-white px-4 py-2 rounded-lg font-bold text-sm border border-white/20 hover:bg-gray-900 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="flex items-center gap-2 bg-[#FACC15] text-black px-4 py-2 rounded-lg border-2 border-black font-bold text-sm shadow-[4px_4px_0px_0px_white] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_white] active:translate-y-1 active:shadow-none transition-all"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
    </>
  );
}