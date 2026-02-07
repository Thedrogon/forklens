'use client';
import { useRef } from 'react';
import { Check, X } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Pricing() {
  const container = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: 'top 75%', // Trigger slightly earlier so it's ready when user sees it
          toggleActions: 'play none none reverse',
          fastScrollEnd: true, // <--- KEY FIX: Forces animation to finish if user scrolls past quickly
        },
      });

      tl.fromTo('.free-plan', { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' })
        .fromTo(
          '.pro-plan',
          { y: -100, opacity: 0, scale: 1.1 }, // Reduced y distance for tighter feel
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6, // Faster duration
            ease: 'back.out(2)', // Snappy "thud" instead of floaty "bounce"
          },
          '-=0.3'
        )
        // The wiggle needs to be faster or it feels like lag
        .to('.pro-plan', {
          rotation: 3,
          duration: 0.08,
          yoyo: true,
          repeat: 3, // Reduced repeats (5 was too long)
          ease: 'linear',
          clearProps: 'rotation', // Clean up afterwards
        });
    },
    { scope: container }
  );

  return (
    // BG: HOT PINK (#F472B6) - Distinct from Hero
    <section
      id="pricing"
      ref={container}
      className="relative overflow-hidden border-b-2 border-black bg-[#F472B6] py-24"
    >
      {/* Texture Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}
      ></div>

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <div className="mb-16 text-center">
          {/* White Text with Black Shadow for Pop */}
          <h2 className="mb-4 text-6xl font-black text-white uppercase drop-shadow-[4px_4px_0px_black]">
            Simple Pricing
          </h2>
          <p className="text-xl font-bold text-black">Start for free. Upgrade when you scale.</p>
        </div>

        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* FREE PLAN: White Card */}
          <div className="free-plan relative rounded-2xl border-2 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform duration-300 hover:scale-[1.02] hover:transform">
            <h3 className="mb-2 text-2xl font-black uppercase">Hobbyist</h3>
            <div className="mb-6 text-4xl font-black">
              $0<span className="text-lg font-bold text-gray-500">/mo</span>
            </div>
            <p className="mb-8 font-bold text-gray-600">Perfect for finding that one library you need.</p>
            <ul className="mb-8 space-y-4">
              <li className="flex items-center gap-3 font-bold">
                <Check size={20} className="text-green-600" /> 50 Searches / Day
              </li>
              <li className="flex items-center gap-3 font-bold">
                <Check size={20} className="text-green-600" /> 4 Saved Graphs
              </li>
              <li className="flex items-center gap-3 font-bold text-gray-400">
                <X size={20} /> Private Repos
              </li>
            </ul>
            <a href="">
              <button className="w-full rounded-xl border-2 border-black bg-gray-100 py-4 font-black shadow-[4px_4px_0px_0px_black] transition-all hover:translate-y-0.5 hover:bg-gray-200 active:translate-y-1 active:shadow-none">
                Start Free
              </button>
            </a>
          </div>

          {/* PRO PLAN: Deep Blueberry Card (Contrasts nicely with Pink BG) */}
          <div className="pro-plan relative transform overflow-hidden rounded-2xl border-2 border-black bg-[#1E1B4B] p-8 text-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-transform duration-300 hover:scale-[1.02]">
            {/* Yellow Badge */}
            <div className="absolute top-4 right-4 rotate-3 border-2 border-black bg-[#FACC15] px-3 py-1 text-xs font-black text-black uppercase shadow-[2px_2px_0px_0px_black]">
              Most Popular
            </div>

            <h3 className="mb-2 text-2xl font-black uppercase">Power User</h3>
            <div className="mb-6 text-4xl font-black">
              $2<span className="text-lg font-bold text-gray-400">/mo</span>
            </div>
            <p className="mb-8 font-bold text-gray-300">For maintainers and heavy researchers.</p>

            <ul className="mb-8 space-y-4">
              {/* Yellow Checks for visibility on dark blue */}
              <li className="flex items-center gap-3 font-bold">
                <Check size={20} className="text-[#FACC15]" /> Unlimited Searches
              </li>
              <li className="flex items-center gap-3 font-bold">
                <Check size={20} className="text-[#FACC15]" /> 50 Saved Graphs
              </li>
              <li className="flex items-center gap-3 font-bold">
                <Check size={20} className="text-[#FACC15]" /> Private Repos Support
              </li>
            </ul>

            {/* White Button with Yellow Shadow */}
            <button className="w-full rounded-xl border-2 border-black bg-white py-4 font-black text-black shadow-[4px_4px_0px_0px_#FACC15] transition-all hover:translate-y-0.5 hover:bg-gray-100 active:translate-y-1 active:shadow-none">
              Coming Soon...
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
