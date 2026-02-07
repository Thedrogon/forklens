'use client';
import { useRef } from 'react';
import { Search, MousePointer2, Share2, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { img } from 'framer-motion/client';

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  const container = useRef(null);

  useGSAP(
    () => {
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
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        });

        tl.fromTo(text, { x: xStartText, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }).fromTo(
          image,
          { x: xStartImage, opacity: 0, scale: 0.9 },
          { x: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.2)' },
          '-=0.6'
        );
      });
    },
    { scope: container }
  );
  const steps = [
    {
      id: '01',
      icon: Search,
      title: 'Paste & Scout',
      desc: 'Drop a GitHub repo link. We instantly map the entire network, visualizing connections hidden in the code.',
      imgColor: 'bg-blue-100',
      // This image is wide like a video
      aspectRatio: 'aspect-ratio[16/9]', 
      imglink: '/search.png' // Make sure these paths match your actual file names in /public
    },
    {
      id: '02',
      icon: MousePointer2,
      title: 'Explore Tree',
      desc: 'Zoom into active branches. Identify dead forks and active contributors at a glance with our color-coded heatmap.',
      imgColor: 'bg-purple-100',
      // This image is very wide and short (a banner shape). 
      // We use an arbitrary tailwind value here.
      aspectRatio: 'aspect-video',
      imglink: '/explore.png'
    },
    {
      id: '03',
      icon: Share2,
      title: 'Save & Flex',
      desc: "Generate a live status badge for your README. Show off your project's health to the world with a single click.",
      imgColor: 'bg-pink-100',
      // This image is a standard rectangular shape, slightly wider than 4:3
      aspectRatio: 'aspect-[3/2]',
      imglink: '/saved.png'
    },
  ];

  return (
    <section ref={container} className="overflow-hidden border-b-2 border-black bg-[#FACC15] py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header: Modern 3D Shadow (Solid, sharp offset) */}
        <div className="mb-24 text-center">
          <h2
            className="section-heading relative z-10 inline-block text-5xl font-black tracking-tight text-black md:text-6xl"
            style={{ textShadow: '4px 4px 0px #ffffff' }}
          >
            HOW IT WORKS
          </h2>
          <div className="mt-4 text-xl font-bold text-black/80">Three steps to clarity.</div>
        </div>

        <div className="flex flex-col gap-24 md:gap-32">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`feature-section flex flex-col items-center gap-12 md:flex-row md:gap-20 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Text Side */}
              <div className="feature-text flex w-full flex-col items-start text-left md:w-1/2">
                {/* Number Badge */}
                <span
                  className="mb-6 text-8xl leading-none font-black text-white/40 select-none"
                  style={{ textShadow: '2px 2px 0px #000000' }}
                >
                  {step.id}
                </span>

                <div className="mb-6 flex items-center gap-4">
                  <div className="rounded-xl bg-black p-4 text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                    <step.icon size={32} />
                  </div>
                  <h3 className="text-4xl font-black tracking-tight text-black uppercase">{step.title}</h3>
                </div>

                <p className="mb-8 text-lg leading-relaxed font-medium text-black/80 md:text-xl">{step.desc}</p>

                
              </div>

              {/* Image Side (The "Pair" Visual) */}
              <div className="feature-image w-full md:w-1/2">
                {/* This is the container for your uploaded pic/screenshot */}
                <div
                  className={`group relative flex ${step.aspectRatio} items-center justify-center overflow-hidden rounded-3xl border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}
                >
                  {/* Mockup UI Header (Browser Bar) */}
                  <div className="absolute top-0 right-0 left-0 z-20 flex h-10 items-center gap-2 border-b-4 border-black bg-black px-4">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-[#FACC15]"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>

                  {/* PLACEHOLDER FOR YOUR IMAGE */}
                  {/* Replace this div with your <img src="..." /> */}
                  <div className="h-full w-full bg-gray-100 pt-10">
                    <img
                      src={step.imglink}
                      alt={step.title}
                      // object-cover: Fills the box
                      // object-top: Ensures the top of your screenshot (the important part) is always visible
                      className="h-full w-full object-cover"
                    />
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
