'use client'
import { useRef } from 'react';
import { Star } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function SocialProof() {
  const container = useRef(null);

  useGSAP(() => {
    gsap.fromTo('.review-card',
      { y: 100, opacity: 0, rotation: (i) => i % 2 === 0 ? -15 : 15 }, // Start twisted
      { 
        y: 0, 
        opacity: 1, 
        rotation: (i) => i % 2 === 0 ? 1 : -1, // Land slightly tilted (organic feel)
        duration: 0.8, 
        stagger: 0.1, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        }
      }
    );
  }, { scope: container });

  const reviews = [
    { text: "Finally, I can find which fork actually has the feature I need.", author: "Sarah J.", role: "Senior Dev @ Vercel-ish", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    { text: "The visualization is sick! I put the badge on my repo immediately.", author: "Mike T.", role: "Maintainer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" },
    { text: "Stopped me from wasting 3 days on a dead fork. Worth every penny.", author: "Alex R.", role: "Full Stack", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" }
  ];

  return (
    <section ref={container} className="py-30 bg-white border-b-2 border-black">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-black text-center mb-16 uppercase">
          Devs <span className="text-purple-600">Love</span> ForkLens
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div key={i} className="review-card p-6 border-2 border-black rounded-xl bg-[#FDF4FF] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => <Star key={j} size={16} className="fill-yellow-400 text-black" strokeWidth={2} />)}
              </div>
              <p className="text-lg font-bold mb-6">"{review.text}"</p>
              <div className="flex items-center gap-3">
                <img src={review.avatar} alt={review.author} className="w-10 h-10 rounded-full border-2 border-black bg-white" />
                <div>
                  <div className="font-black text-sm">{review.author}</div>
                  <div className="text-xs font-bold text-gray-500 uppercase">{review.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}