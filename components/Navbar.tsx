'use client'
import Link from 'next/link';
import { GitFork, Github, LogIn, Star } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDF4FF]/90 backdrop-blur-md border-b-2 border-black h-20 flex items-center justify-center px-6 lg:px-15">

      <div className='max-w-6xl w-full flex items-center justify-between h-full'>

      
      
      {/* Logo Area */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="bg-purple-600 p-1.5 rounded-lg border-2 border-black group-hover:translate-y-0.5 transition-transform">
           <GitFork className="text-white w-5 h-5" />
        </div>
        <span className="text-2xl font-black tracking-tight">ForkLens</span>
      </Link>

      {/* Center Links (Optional) */}
      <div className="hidden md:flex gap-6 font-bold text-sm">
        <Link href="#features" className="hover:text-purple-600 hover:underline decoration-2">Features</Link>
        <Link href="#pricing" className="hover:text-purple-600 hover:underline decoration-2">Pricing</Link>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* GitHub Stats Badge */}
        <a 
          href="https://github.com/yourusername/forklens" 
          target="_blank"
          className="hidden sm:flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all text-xs font-bold"
        >
          <Github className="w-4 h-4" />
          <span>Star us</span>
          <div className="w-px h-4 bg-gray-300 mx-1" />
          <div className="flex items-center gap-1 text-yellow-600">
            <Star className="w-3 h-3 fill-current" />
            <span>124</span>
          </div>
        </a>

        {/* Auth Buttons */}
        {session ? (
           <div className="flex items-center gap-3">
             <Link href="/dashboard" className="font-bold hover:underline">
               My Graphs
             </Link>
             <button 
               onClick={() => signOut()}
               className="bg-black text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-800"
             >
               Sign Out
             </button>
           </div>
        ) : (
          <button 
            onClick={() => signIn('github')}
            className="flex items-center gap-2 bg-[#C084FC] px-4 py-2 rounded-lg border-2 border-black font-bold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-px hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <LogIn className="w-4 h-4" />
            Login
          </button>
        )}
      </div>
      </div>
    </nav>
  );
}