'use client';

import { useState, useMemo, useRef } from 'react';
import ReactFlow, { Background, Controls, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { Clock, Zap, Layout, ArrowRight, Star } from 'lucide-react';
import { getForkData } from './action';
import ForkNode from '@/components/ForkNode';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LandingGraph from '@/components/LandingGraph';

// GSAP
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// NEW SECTIONS
import HowItWorks from '@/components/HowItWorks';
import SocialProof from '@/components/SocialProof';
import Pricing from '@/components/Pricing';

gsap.registerPlugin(ScrollTrigger);

const nodeTypes = {
  forkNode: ForkNode,
};

// --- HELPER FUNCTION ---
const processGraph = (data: any, rootName: string, currentMode: 'graph' | 'timeline') => {
  const mainNode: Node = {
    id: 'root',
    type: 'input',
    data: { label: rootName },
    position: { x: 0, y: 0 },
    style: {
      background: '#111',
      color: '#fff',
      border: '2px solid #000',
      fontWeight: 'bold',
      width: 180,
      padding: 10,
      borderRadius: 8,
      textAlign: 'center',
    },
  };

  let newNodes: Node[] = [mainNode];
  let newEdges: Edge[] = [];

  if (data && data.forks) {
    data.forks.nodes.forEach((fork: any, index: number) => {
      const daysAgo = Math.floor((new Date().getTime() - new Date(fork.pushedAt).getTime()) / (1000 * 3600 * 24));
      const isActive = daysAgo < 30;
      let x = 0,
        y = 0;

      if (currentMode === 'timeline') {
        x = 600 - daysAgo * 3;
        y = (index % 2 === 0 ? -1 : 1) * (Math.random() * 400);
        mainNode.position = { x: 700, y: 0 };
      } else {
        const angle = (index / (data.forks.nodes.length + 1)) * 2 * Math.PI;
        const radius = 400 + index * 10;
        x = Math.cos(angle) * radius;
        y = Math.sin(angle) * radius;
        mainNode.position = { x: 0, y: 0 };
      }

      newNodes.push({
        id: fork.nameWithOwner,
        type: 'forkNode',
        data: {
          label: fork.nameWithOwner,
          avatar: fork.owner.avatarUrl,
          stars: fork.stargazerCount,
          daysAgo: daysAgo,
          url: fork.url,
        },
        position: { x, y },
        draggable: true,
      });

      newEdges.push({
        id: `e-root-${fork.nameWithOwner}`,
        source: 'root',
        target: fork.nameWithOwner,
        animated: isActive,
        style: {
          stroke: isActive ? '#84cc16' : '#cbd5e1',
          strokeWidth: isActive ? 2 : 1,
        },
      });
    });
  }

  return { nodes: newNodes, edges: newEdges };
};

export default function LandingPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [view, setView] = useState<'search' | 'graph'>('search');
  const [mode, setMode] = useState<'graph' | 'timeline'>('graph');
  const [lastData, setLastData] = useState<any>(null);
  const [lastRoot, setLastRoot] = useState<string>('');

  const containerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroInputRef = useRef<HTMLDivElement>(null);
  const featureSectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (view === 'search') {
      if (heroTextRef.current) {
        gsap.fromTo(
          heroTextRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
        );
      }

      if (heroInputRef.current) {
        gsap.fromTo(
          heroInputRef.current,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: 'back.out(1.7)',
            delay: 0.6,
          }
        );
      }

      gsap.to('.scroll-arrow', {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 0.8,
        ease: 'power1.inOut',
      });

      const cards = gsap.utils.toArray('.feature-card');
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: featureSectionRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }
  }, [view]);

  const handleSearch = async () => {
    const cleanInput = input.replace('https://github.com/', '');
    if (!cleanInput.includes('/')) return alert('Use format: owner/repo');

    setLoading(true);
    const [owner, repo] = cleanInput.split('/');

    const result = await getForkData(owner, repo);

    if (result.success && result.data) {
      setLastData(result.data);
      setLastRoot(`${owner}/${repo}`);

      const { nodes: newNodes, edges: newEdges } = processGraph(result.data, `${owner}/${repo}`, mode);
      setNodes(newNodes);
      setEdges(newEdges);

      setView('graph');
    } else {
      alert('Repo not found or API limit reached!');
    }
    setLoading(false);
  };

  const toggleMode = (newMode: 'graph' | 'timeline') => {
    setMode(newMode);
    if (lastData && lastRoot) {
      const { nodes: newNodes, edges: newEdges } = processGraph(lastData, lastRoot, newMode);
      setNodes(newNodes);
      setEdges(newEdges);
    }
  };

  return (
    <main ref={containerRef} className="flex min-h-screen flex-col font-sans">
      <Navbar />

      {/* --- HERO SECTION: DEEP BLUEBERRY --- */}
      {view === 'search' ? (
        <div className="relative flex min-h-[95vh] grow flex-col items-center justify-center overflow-hidden border-b-2 border-black bg-[#1E1B4B] px-4">
          {/* Dot Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-14"
            style={{
              backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          ></div>

          <div ref={heroTextRef} className="z-10 w-full max-w-4xl space-y-8 text-center">
            {/* Badge */}
            <div className="mb-6 inline-block -rotate-2 transform rounded-full border-2 border-black bg-[#FACC15] px-4 py-1.5 text-xs font-black tracking-widest uppercase shadow-[4px_4px_0px_0px_white]">
              ✨ New: Timeline View Added!
            </div>

            {/* Title - Responsive sizing */}
            <h1 className="text-5xl leading-[0.9] font-black tracking-tighter text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] md:text-6xl">
              STOP DIGGING <br />
              <span className="animate-gradient-x bg-linear-to-r from-[#C084FC] via-[#FACC15] to-[#C084FC] bg-clip-text font-black text-transparent md:text-8xl">
                DEAD FORKS.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto max-w-2xl px-2 text-xl font-bold text-gray-300 md:text-2xl">
              Visualize repository history.{' '}
              <span className="text-white underline decoration-[#F472B6] decoration-wavy">Free for open source.</span>
            </p>

            {/* Input Container - Always Row, No Stacking */}
            <div
              ref={heroInputRef}
              className="mx-auto mt-8 flex w-full max-w-xl transform flex-row items-center gap-2 rounded-xl border-2 border-black bg-white p-2 shadow-[8px_8px_0px_0px_#C084FC] transition-transform duration-300 hover:scale-[1.02]"
            >
              <input
                type="text"
                placeholder="facebook/react"
                // KEY FIX 1: 'min-w-0' allows the input to shrink below its default size on tiny screens
                className="min-w-0 flex-1 bg-transparent px-2 text-base font-bold text-black outline-none placeholder:text-gray-400 md:px-4 md:text-lg"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />

              <button
                onClick={handleSearch}
                disabled={loading}
                // KEY FIX 2: Reduced padding (px-4) and text size (text-sm) on mobile.
                // 'shrink-0' ensures the button doesn't get squashed.
                className="shrink-0 rounded-lg border-2 border-black bg-[#1E1B4B] px-4 py-3 text-sm font-black whitespace-nowrap text-white transition-all hover:bg-black active:translate-y-1 active:shadow-none md:px-8 md:py-4 md:text-base"
              >
                {loading ? '...' : 'DIAGRAM'}
              </button>
            </div>
          </div>

          <div className="scroll-arrow absolute bottom-10 animate-bounce">
            <ArrowRight className="h-8 w-8 rotate-90 text-white" />
          </div>
        </div>
      ) : (
        /* --- GRAPH VIEW (Unchanged) --- */
        <div className="relative h-[calc(100vh-80px)] w-full border-t-2 border-black bg-white">
          <button
            onClick={() => setView('search')}
            className="absolute top-5 left-5 z-20 rounded-lg border-2 border-black bg-white px-4 py-2 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:shadow-none"
          >
            ← New Search
          </button>
          <div className="absolute top-5 right-5 z-20 flex overflow-hidden rounded-lg border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <button
              onClick={() => toggleMode('graph')}
              className={`px-4 py-2 text-sm font-bold transition-colors ${mode === 'graph' ? 'bg-[#C084FC] text-black' : 'hover:bg-gray-100'}`}
            >
              Graph
            </button>
            <div className="w-0.5 bg-black"></div>
            <button
              onClick={() => toggleMode('timeline')}
              className={`px-4 py-2 text-sm font-bold transition-colors ${mode === 'timeline' ? 'bg-[#C084FC] text-black' : 'hover:bg-gray-100'}`}
            >
              Timeline
            </button>
          </div>
          <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView minZoom={0.1}>
            <Background color="#ccc" gap={20} />
            <Controls className="border-2! border-black! bg-white! shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]!" />
          </ReactFlow>
        </div>
      )}

      {/* --- MARKETING SECTIONS (Only in Search Mode) --- */}
      {view === 'search' && (
        <>
          {/* Features Section (White) */}
          <section ref={featureSectionRef} id="features" className="border-b-2 border-black bg-white px-6 py-20">
            <div className="mx-auto max-w-6xl">
              <div className="feature-card mb-24 grid items-center gap-12 md:grid-cols-2">
                <div className="space-y-6">
                  <h2 className="text-5xl font-black tracking-tight">
                    Don't just look. <br /> Interact with it.
                  </h2>
                  <p className="text-lg text-gray-600">Try it right now. This is a live visualization.</p>
                  <ul className="space-y-3">
                    {['Drag to pan', 'Scroll to zoom', 'Click nodes to visit'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 font-bold">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-green-400 text-xs">
                          ✓
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="group relative h-96">
                  <div className="absolute inset-0 translate-x-2 translate-y-2 transform rounded-2xl bg-black transition-transform group-hover:translate-x-3 group-hover:translate-y-3"></div>
                  <div className="relative h-full w-full overflow-hidden rounded-2xl border-2 border-black bg-white shadow-inner">
                    <LandingGraph />
                  </div>
                </div>
              </div>

              {/* Feature Grid */}
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  {
                    title: 'Timeline View',
                    icon: Clock,
                    desc: 'See forks arranged by time.',
                  },
                  {
                    title: 'Save & Share',
                    icon: Star,
                    desc: 'Logged in users can save up to 4 graphs.',
                  },
                  {
                    title: 'Daily Quotas',
                    icon: Zap,
                    desc: 'Smart rate limiting ensures fair usage.',
                  },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="feature-card rounded-xl border-2 border-black bg-[#FDF4FF] p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <feature.icon className="mb-4 h-10 w-10 text-purple-600" />
                    <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* New Sections */}
          <HowItWorks />
          <SocialProof />
          <Pricing />
        </>
      )}

      {view === 'search' && <Footer />}
    </main>
  );
}
