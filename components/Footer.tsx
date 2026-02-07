'use client';
import Link from 'next/link';
import { GitFork, Github, Linkedin, Heart, Sparkles, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t-2 border-black bg-white px-6 pt-16 pb-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 grid gap-12 md:grid-cols-4">
          {/* 1. Brand & Mission */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2 text-purple-600">
              <div className="rounded-lg bg-black p-2 text-white">
                <GitFork className="h-6 w-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-black">ForkLens</span>
            </div>
            <p className="max-w-sm leading-relaxed font-medium text-gray-500">
              ForkLens help developers visualize the open source universe, turning complex git trees into clear,
              actionable insights.
            </p>
          </div>

          {/* 2. Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-black tracking-widest text-black uppercase">Legal</h4>
            <Link
              href="/terms"
              className="font-bold text-gray-600 transition-all hover:translate-x-1 hover:text-purple-600"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="font-bold text-gray-600 transition-all hover:translate-x-1 hover:text-purple-600"
            >
              Privacy Policy
            </Link>
            <a
              href="mailto:support@forklens.com"
              className="font-bold text-gray-600 transition-all hover:translate-x-1 hover:text-purple-600"
            >
              Contact Support
            </a>
          </div>

          {/* 3. The Portfolio "CTA" (Styled Box) */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-black tracking-widest text-black uppercase">Creator</h4>

            {/* Visual Portfolio Link */}
            
              <div className="flex flex-col gap-4">

                {/* Signature Quote */}
                <div className="relative rounded-xl border-2 border-black bg-[#FDF4FF] p-5 shadow-[4px_4px_0px_black]">
                  {/* Accent */}
                  <div className="absolute top-4 left-0 h-10 w-1 bg-purple-500" />

                  <p className="text-[17px] leading-relaxed text-black/70 italic">
                    Hi, I’m <span className="font-bold text-[#1E1B4B] not-italic">Shayan</span>, creator of ForkLens.
                    If this helped you, feel free to explore my work and support the project.
                  </p>

                  <div className="mt-4 flex gap-4 text-xs font-black tracking-wide uppercase">
                    <a
                      href="https://shayanmukherjee.dev"
                      target="_blank"
                      className="border-b border-transparent text-purple-600 transition-all hover:border-purple-500 hover:text-purple-500"
                    >
                      Portfolio
                    </a>

                    <a
                      href="https://github.com/thedrogon/forklens"
                      target="_blank"
                      className="border-b border-transparent text-black/70 transition-all hover:border-black hover:text-black"
                    >
                      Star on GitHub
                    </a>
                  </div>
                </div>
              </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-8 h-0.5 w-full bg-gray-100" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-6 text-sm md:flex-row">
          {/* Copyright */}
          <div className="font-bold text-gray-400">© {new Date().getFullYear()} ForkLens.</div>

          {/* The "Love & AI" Badge */}
          <div className="flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-4 py-2">
            <span className="flex items-center gap-1 font-bold text-gray-600">
              Made with <Heart className="h-4 w-4 animate-pulse fill-red-500 text-red-500" /> &
            </span>
            <span className="flex items-center gap-1 font-bold text-purple-600">
              <Sparkles className="h-4 w-4" /> Gemini
            </span>
          </div>

          {/* Socials (LinkedIn & GitHub) */}
          <div className="flex gap-3">
            <a
              href="https://github.com/thedrogon"
              target="_blank"
              className="rounded-lg border-2 border-transparent bg-gray-100 p-2 text-gray-600 transition-all hover:border-black hover:bg-white hover:text-black"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com/in/sayanjit-mukherjee/"
              target="_blank"
              className="rounded-lg border-2 border-transparent bg-gray-100 p-2 text-gray-600 transition-all hover:border-black hover:bg-[#0077b5] hover:text-white"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
