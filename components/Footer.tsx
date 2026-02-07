'use client'
import Link from 'next/link';
import { GitFork, Github, Linkedin, Heart, Sparkles, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t-2 border-black bg-white pt-16 pb-8 px-6 mt-auto">
      <div className="max-w-6xl mx-auto">
        
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          
          {/* 1. Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-purple-600">
              <div className="p-2 bg-black text-white rounded-lg">
                <GitFork className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-black">ForkLens</span>
            </div>
            <p className="text-gray-500 font-medium max-w-sm leading-relaxed">
              ForkLens help developers visualize the open source universe, turning complex git trees into clear, actionable insights.
            </p>
          </div>

          {/* 2. Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-black text-black uppercase tracking-widest text-sm">Legal</h4>
            <Link href="/terms" className="text-gray-600 font-bold hover:text-purple-600 hover:translate-x-1 transition-all">Terms of Service</Link>
            <Link href="/privacy" className="text-gray-600 font-bold hover:text-purple-600 hover:translate-x-1 transition-all">Privacy Policy</Link>
            <a href="mailto:support@forklens.com" className="text-gray-600 font-bold hover:text-purple-600 hover:translate-x-1 transition-all">Contact Support</a>
          </div>

          {/* 3. The Portfolio "CTA" (Styled Box) */}
          <div className="flex flex-col gap-4">
            <h4 className="font-black text-black uppercase tracking-widest text-sm">Creator</h4>
            
            {/* Visual Portfolio Link */}
            <a 
              href="https://yourportfolio.com" // REPLACE WITH YOUR LINK
              target="_blank"
              className="group bg-[#FACC15] border-2 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-black/60">Built by</p>
                <p className="font-black text-black text-lg">Your Name</p>
              </div>
              <div className="bg-white p-2 rounded-full border-2 border-black group-hover:rotate-45 transition-transform">
                <ArrowUpRight size={20} className="text-black" />
              </div>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-0.5 bg-gray-100 mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          
          {/* Copyright */}
          <div className="font-bold text-gray-400">
            © {new Date().getFullYear()} ForkLens.
          </div>

          {/* The "Love & AI" Badge */}
          <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full border border-purple-100">
            <span className="font-bold text-gray-600 flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> & 
            </span>
            <span className="font-bold text-purple-600 flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> Gemini
            </span>
          </div>

          {/* Socials (LinkedIn & GitHub) */}
          <div className="flex gap-3">
            <a 
              href="https://github.com/yourusername" 
              target="_blank" 
              className="p-2 bg-gray-100 rounded-lg border-2 border-transparent hover:border-black hover:bg-white text-gray-600 hover:text-black transition-all"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://linkedin.com/in/yourusername" 
              target="_blank" 
              className="p-2 bg-gray-100 rounded-lg border-2 border-transparent hover:border-black hover:bg-[#0077b5] hover:text-white text-gray-600 transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}