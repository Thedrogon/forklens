// components/LoginModal.tsx
'use client'
import { X, Github, GitFork } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      
      {/* 1. The Backdrop (Blur & Dim) */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* 2. The Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
        >
          <X size={20} />
        </button>

        {/* Header Content */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-50 text-purple-600 rounded-xl mb-4">
            <GitFork size={28} />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-gray-900">
            Welcome to ForkLens
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Sign in to save your graphs, track your usage, and unlock premium features.
          </p>
        </div>

        {/* GitHub Button */}
        <button
          onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
          className="w-full flex items-center justify-center gap-3 bg-[#24292F] hover:bg-[#24292F]/90 text-white font-bold h-12 rounded-xl transition-all transform active:scale-95 shadow-lg hover:shadow-xl"
        >
          <Github size={20} />
          <span>Continue with GitHub</span>
        </button>

        {/* Terms Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          By clicking continue, you agree to our <a href="#" className="underline hover:text-gray-900">Terms of Service</a> and <a href="#" className="underline hover:text-gray-900">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}