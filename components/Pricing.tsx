'use client'
import { useRef } from 'react';
import { Check, X } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Pricing() {
  const container = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 70%",
      }
    });

    // 1. Free Plan slides in
    tl.fromTo('.free-plan',
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6 }
    )
    
    // 2. Pro Plan DROPS from sky
    .fromTo('.pro-plan',
      { y: -200, opacity: 0, scale: 1.1 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "bounce.out" }, // <--- The Bonkers Bounce
      "-=0.3"
    )
    
    // 3. Pro Plan Shakes a little after landing
    .to('.pro-plan', { rotation: 2, duration: 0.1, yoyo: true, repeat: 5, ease: "linear" });

  }, { scope: container });

  return (
    <section id="pricing" ref={container} className="py-24 bg-purple-50 border-b-2 border-black overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-4 uppercase">Simple Pricing</h2>
          <p className="text-xl font-bold text-gray-600">Start for free. Upgrade when you scale.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          
          {/* FREE PLAN */}
          <div className="free-plan bg-white border-2 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
            <h3 className="text-2xl font-black uppercase mb-2">Hobbyist</h3>
            <div className="text-4xl font-black mb-6">$0<span className="text-lg text-gray-500 font-bold">/mo</span></div>
            <p className="text-gray-600 font-bold mb-8">Perfect for finding that one library you need.</p>
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3 font-bold items-center"><Check size={20} className="text-green-600" /> 50 Searches / Day</li>
              <li className="flex gap-3 font-bold items-center"><Check size={20} className="text-green-600" /> 4 Saved Graphs</li>
              <li className="flex gap-3 font-bold items-center text-gray-400"><X size={20} /> Private Repos</li>
            </ul>
            <button className="w-full py-4 rounded-xl border-2 border-black font-black bg-gray-100 hover:bg-gray-200 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none">
              Start Free
            </button>
          </div>

          {/* PRO PLAN */}
          <div className="pro-plan bg-[#C084FC] border-2 border-black rounded-2xl p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-yellow-300 border-2 border-black px-3 py-1 text-xs font-black uppercase rotate-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Most Popular
            </div>
            <h3 className="text-2xl font-black uppercase mb-2">Power User</h3>
            <div className="text-4xl font-black mb-6">$9<span className="text-lg text-black/60 font-bold">/mo</span></div>
            <p className="text-black/80 font-bold mb-8">For maintainers and heavy researchers.</p>
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3 font-bold items-center"><Check size={20} /> Unlimited Searches</li>
              <li className="flex gap-3 font-bold items-center"><Check size={20} /> 50 Saved Graphs</li>
              <li className="flex gap-3 font-bold items-center"><Check size={20} /> Private Repos Support</li>
            </ul>
            <button className="w-full py-4 rounded-xl border-2 border-black font-black bg-black text-white hover:bg-gray-800 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] active:translate-y-1 active:shadow-none">
              Join Waitlist
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}