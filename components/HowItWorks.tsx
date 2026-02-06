'use client'
import { useRef } from 'react';
import { Search, MousePointer2, Share2, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  const container = useRef(null);

  useGSAP(() => {
    // 1. Tell GSAP to select these elements and treat them as an array of HTMLElements
    const sections = gsap.utils.toArray('.feature-section') as HTMLElement[];

    sections.forEach((section, i) => {
      // Now TypeScript knows 'section' is an HTML element
      const text = section.querySelector('.feature-text');
      const image = section.querySelector('.feature-image');

      // Alternating entrance direction based on index
      const xStartText = i % 2 === 0 ? -100 : 100;
      const xStartImage = i % 2 === 0 ? 100 : -100;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        }
      });

      tl.fromTo(text, 
        { x: xStartText, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      )
      .fromTo(image,
        { x: xStartImage, opacity: 0, scale: 0.9 },
        { x: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.2)" },
        "-=0.6"
      );
    });

  }, { scope: container });
  const steps = [
    { 
      id: "01",
      icon: Search, 
      title: "Paste & Scout", 
      desc: "Drop a GitHub repo link. We instantly map the entire network, visualizing connections hidden in the code.",
      // Placeholder for your actual image
      imgColor: "bg-blue-100" 
    },
    { 
      id: "02",
      icon: MousePointer2, 
      title: "Explore Tree", 
      desc: "Zoom into active branches. Identify dead forks and active contributors at a glance with our color-coded heatmap.",
      imgColor: "bg-purple-100"
    },
    { 
      id: "03",
      icon: Share2, 
      title: "Save & Flex", 
      desc: "Generate a live status badge for your README. Show off your project's health to the world with a single click.",
      imgColor: "bg-pink-100"
    }
  ];

  return (
    <section ref={container} className="py-24 bg-[#FACC15] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header: Modern 3D Shadow (Solid, sharp offset) */}
        <div className="text-center mb-24">
          <h2 className="section-heading text-5xl md:text-6xl font-black text-black tracking-tight inline-block relative z-10"
              style={{ textShadow: "4px 4px 0px #ffffff" }}>
            HOW IT WORKS
          </h2>
          <div className="mt-4 text-xl font-bold text-black/80">
            Three steps to clarity.
          </div>
        </div>

        <div className="flex flex-col gap-24 md:gap-32">
          {steps.map((step, i) => (
            <div key={i} className={`feature-section flex flex-col md:flex-row items-center gap-12 md:gap-20 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              
              {/* Text Side */}
              <div className="feature-text w-full md:w-1/2 flex flex-col items-start text-left">
                {/* Number Badge */}
                <span className="text-8xl font-black text-white/40 leading-none mb-6 select-none"
                      style={{ textShadow: "2px 2px 0px #000000" }}>
                  {step.id}
                </span>

                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-black text-white rounded-xl shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                    <step.icon size={32} />
                  </div>
                  <h3 className="text-4xl font-black text-black uppercase tracking-tight">
                    {step.title}
                  </h3>
                </div>
                
                <p className="text-lg md:text-xl font-medium text-black/80 leading-relaxed mb-8">
                  {step.desc}
                </p>

                <button className="group flex items-center gap-2 font-bold border-b-2 border-black pb-1 hover:gap-4 transition-all">
                  See details <ArrowRight size={18} />
                </button>
              </div>

              {/* Image Side (The "Pair" Visual) */}
              <div className="feature-image w-full md:w-1/2">
                {/* This is the container for your uploaded pic/screenshot */}
                <div className={`relative aspect-4/3 rounded-3xl border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex items-center justify-center group hover:translate-x-1 hover:translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300`}>
                  
                  {/* Mockup UI Header (Browser Bar) */}
                  <div className="absolute top-0 left-0 right-0 h-10 bg-black border-b-4 border-black flex items-center px-4 gap-2 z-20">
                    <div className="w-3 h-3 rounded-full bg-[#FACC15]"></div>
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                  </div>

                  {/* PLACEHOLDER FOR YOUR IMAGE */}
                  {/* Replace this div with your <img src="..." /> */}
                  <div className={`w-full h-full pt-10 ${step.imgColor} flex items-center justify-center`}>
                    <p className="font-bold text-black/20 text-2xl uppercase text-center px-8">
                      {step.title} Screenshot
                    </p>
                  </div>

                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}