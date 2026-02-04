'use client'
import Link from 'next/link';
import { GitFork, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t-2 border-black bg-white py-12 px-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2 text-purple-600">
            <GitFork className="w-6 h-6" />
            <span className="text-xl font-bold tracking-tight text-black">ForkLens</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Visualize the open source universe.
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-8 text-sm font-bold text-gray-600">
          <Link href="/terms" className="hover:text-purple-600 transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-purple-600 transition-colors">Privacy</Link>
          <a href="mailto:support@forklens.com" className="hover:text-purple-600 transition-colors">Contact</a>
        </div>

        {/* Socials */}
        <div className="flex gap-4">
          <a 
            href="https://github.com/yourusername" 
            target="_blank" 
            className="p-2 bg-gray-100 rounded-full border-2 border-transparent hover:border-black hover:bg-white transition-all"
          >
            <Github className="w-5 h-5" />
          </a>
          <a 
            href="https://twitter.com/yourusername" 
            target="_blank" 
            className="p-2 bg-gray-100 rounded-full border-2 border-transparent hover:border-black hover:bg-white transition-all"
          >
            <Twitter className="w-5 h-5" />
          </a>
        </div>
      </div>
      
      <div className="text-center text-xs font-bold text-gray-400 mt-12">
        © {new Date().getFullYear()} ForkLens. Open Source is beautiful.
      </div>
    </footer>
  );
}