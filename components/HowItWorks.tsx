'use client'
import { useRef } from 'react';
import { Search, MousePointer2, Share2 } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  const container = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 75%", // Starts when top of section hits 75% of viewport
        toggleActions: "play none none reverse",
      }
    });

    // 1. Draw the line (Desktop only)
    tl.fromTo('.connector-line', 
      { scaleX: 0, transformOrigin: "left center" },
      { scaleX: 1, duration: 1, ease: "power4.out" }
    )
    
    // 2. Pop the numbers (Spin & Scale)
    .fromTo('.step-number',
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.6, stagger: 0.1, ease: "back.out(2)" },
      "-=0.5" // Start overlap
    )

    // 3. Slam the cards (Y-axis bounce)
    .fromTo('.step-card',
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "elastic.out(1, 0.5)" },
      "-=0.4"
    );

  }, { scope: container });

  const steps = [
    { icon: Search, title: "Paste & Scout", desc: "Drop a GitHub repo link. We fetch the data instantly." },
    { icon: MousePointer2, title: "Explore Tree", desc: "Zoom, drag, and pan through fork history." },
    { icon: Share2, title: "Save & Flex", desc: "Generate a live badge for your README." }
  ];

  return (
    <section ref={container} className="py-24 bg-yellow-300 border-t-2 border-b-2 border-black overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-5xl font-black tracking-tighter uppercase transform -rotate-1">How it Works</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Animated Line */}
          <div className="connector-line hidden md:block absolute top-8 left-0 w-full h-2 bg-black -z-10" />

          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              {/* Animated Number */}
              <div className="step-number w-16 h-16 bg-white border-2 border-black rounded-full flex items-center justify-center text-2xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6 z-10">
                {i + 1}
              </div>
              
              {/* Animated Card */}
              <div className="step-card bg-white p-8 border-2 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 w-full">
                <div className="bg-purple-100 w-12 h-12 mx-auto rounded-lg border-2 border-black flex items-center justify-center mb-4">
                  <step.icon size={24} className="text-purple-600" />
                </div>
                <h3 className="text-2xl font-black mb-3">{step.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}