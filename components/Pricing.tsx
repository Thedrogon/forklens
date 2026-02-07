'use client'
import { useRef } from 'react';
import { Check, X } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Pricing() {
  const container = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 75%", // Trigger slightly earlier so it's ready when user sees it
        toggleActions: "play none none reverse",
        fastScrollEnd: true, // <--- KEY FIX: Forces animation to finish if user scrolls past quickly
      }
    });

    tl.fromTo('.free-plan',
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
    )
    .fromTo('.pro-plan',
      { y: -100, opacity: 0, scale: 1.1 }, // Reduced y distance for tighter feel
      { 
        y: 0, 
        opacity: 1, 
        scale: 1, 
        duration: 0.6, // Faster duration
        ease: "back.out(2)", // Snappy "thud" instead of floaty "bounce"
      }, 
      "-=0.3"
    )
    // The wiggle needs to be faster or it feels like lag
    .to('.pro-plan', { 
      rotation: 3, 
      duration: 0.08, 
      yoyo: true, 
      repeat: 3, // Reduced repeats (5 was too long)
      ease: "linear",
      clearProps: "rotation" // Clean up afterwards
    });

  }, { scope: container });

  
  return (
    // BG: HOT PINK (#F472B6) - Distinct from Hero
    <section id="pricing" ref={container} className="py-24 bg-[#F472B6] border-b-2 border-black overflow-hidden relative">
      
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          {/* White Text with Black Shadow for Pop */}
          <h2 className="text-6xl font-black mb-4 uppercase text-white drop-shadow-[4px_4px_0px_black]">
            Simple Pricing
          </h2>
          <p className="text-xl font-bold text-black">Start for free. Upgrade when you scale.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          
          {/* FREE PLAN: White Card */}
          <div className="free-plan bg-white border-2 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative hover:transform hover:scale-[1.02] transition-transform duration-300">
            <h3 className="text-2xl font-black uppercase mb-2">Hobbyist</h3>
            <div className="text-4xl font-black mb-6">$0<span className="text-lg text-gray-500 font-bold">/mo</span></div>
            <p className="text-gray-600 font-bold mb-8">Perfect for finding that one library you need.</p>
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3 font-bold items-center"><Check size={20} className="text-green-600" /> 50 Searches / Day</li>
              <li className="flex gap-3 font-bold items-center"><Check size={20} className="text-green-600" /> 4 Saved Graphs</li>
              <li className="flex gap-3 font-bold items-center text-gray-400"><X size={20} /> Private Repos</li>
            </ul>
            <button className="w-full py-4 rounded-xl border-2 border-black font-black bg-gray-100 hover:bg-gray-200 transition-all shadow-[4px_4px_0px_0px_black] active:translate-y-1 active:shadow-none hover:translate-y-0.5">
              Start Free
            </button>
          </div>

          {/* PRO PLAN: Deep Blueberry Card (Contrasts nicely with Pink BG) */}
          <div className="pro-plan bg-[#1E1B4B] text-white border-2 border-black rounded-2xl p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
            {/* Yellow Badge */}
            <div className="absolute top-4 right-4 bg-[#FACC15] text-black border-2 border-black px-3 py-1 text-xs font-black uppercase rotate-3 shadow-[2px_2px_0px_0px_black]">
              Most Popular
            </div>
            
            <h3 className="text-2xl font-black uppercase mb-2">Power User</h3>
            <div className="text-4xl font-black mb-6">$9<span className="text-lg text-gray-400 font-bold">/mo</span></div>
            <p className="text-gray-300 font-bold mb-8">For maintainers and heavy researchers.</p>
            
            <ul className="space-y-4 mb-8">
              {/* Yellow Checks for visibility on dark blue */}
              <li className="flex gap-3 font-bold items-center"><Check size={20} className="text-[#FACC15]" /> Unlimited Searches</li>
              <li className="flex gap-3 font-bold items-center"><Check size={20} className="text-[#FACC15]" /> 50 Saved Graphs</li>
              <li className="flex gap-3 font-bold items-center"><Check size={20} className="text-[#FACC15]" /> Private Repos Support</li>
            </ul>

            {/* White Button with Yellow Shadow */}
            <button className="w-full py-4 rounded-xl border-2 border-black font-black bg-white text-black hover:bg-gray-100 transition-all shadow-[4px_4px_0px_0px_#FACC15] active:translate-y-1 active:shadow-none hover:translate-y-0.5">
              Coming Soon...
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}