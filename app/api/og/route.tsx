import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const repo = searchParams.get('repo') || 'facebook/react';
  const active = searchParams.get('active') || '15';
  const total = searchParams.get('total') || '120';

  const centerX = 600;
  const centerY = 315;
  const nodes = [];
  const lines = [];
  
  const GOLDEN_ANGLE = 137.5 * (Math.PI / 180);
  
  // FIX 1: Reduced Scale (Closer together)
  const SCALE = 140; 

  for (let i = 1; i <= 14; i++) {
    const r = SCALE * Math.sqrt(i);
    const theta = i * GOLDEN_ANGLE;
    
    const x = centerX + r * Math.cos(theta);
    const y = centerY + r * Math.sin(theta);
    
    const isActive = i % 3 === 0;

    lines.push(
      <path
        key={`line-${i}`}
        d={`M${centerX} ${centerY} L${x} ${y}`}
        stroke={isActive ? "#C084FC" : "#cbd5e1"}
        strokeWidth="3"
      />
    );

    nodes.push(
      <div
        key={`node-${i}`}
        style={{
          position: 'absolute',
          left: x - 60,
          top: y - 25,
          width: 120,
          height: 50,
          backgroundColor: 'white',
          border: `2px solid ${isActive ? '#C084FC' : 'black'}`,
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
          zIndex: 10,
        }}
      >
        <div style={{ width: '70%', height: '8px', backgroundColor: '#111', borderRadius: '2px', marginBottom: '6px', opacity: 0.8 }} />
        <div style={{ width: '40%', height: '6px', backgroundColor: isActive ? '#C084FC' : '#e5e7eb', borderRadius: '2px' }} />
      </div>
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FDF4FF',
          backgroundImage: 'radial-gradient(circle at 2px 2px, #e5e7eb 1px, transparent 0)',
          backgroundSize: '24px 24px',
          position: 'relative',
        }}
      >
        <svg width="1200" height="630" style={{ position: 'absolute', top: 0, left: 0 }}>
          {lines}
        </svg>

        {nodes}

        {/* FIX 2: Bigger Root Box (400px wide) to fit names */}
        <div
          style={{
            position: 'absolute',
            left: centerX - 200, // Centered (half of 400)
            top: centerY - 40,
            width: 400, // Wide enough for long names
            height: 80,
            backgroundColor: '#111',
            color: 'white',
            border: '4px solid black',
            borderRadius: '50px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '8px 8px 0px 0px rgba(0,0,0,0.3)',
            zIndex: 20,
          }}
        >
          {/* Truncate if insanely long, but 400px fits most */}
          <span style={{ fontSize: 24, fontWeight: 900, maxWidth: '380px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {repo.split('/')[1] || repo}
          </span>
          <span style={{ fontSize: 14, color: '#aaa' }}>{repo.split('/')[0]}</span>
        </div>

        <div style={{
          position: 'absolute',
          bottom: 30,
          left: 30,
          display: 'flex',
          gap: '20px'
        }}>
           <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#FDF4FF', border: '3px solid black', padding: '10px 25px', borderRadius: '40px', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}>
              <span style={{ fontSize: 24, fontWeight: 'bold', color: 'black' }}>{active} Active</span>
           </div>
           <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', border: '3px solid black', padding: '10px 25px', borderRadius: '40px', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}>
              <span style={{ fontSize: 24, fontWeight: 'bold', color: '#6b7280' }}>{total} Total</span>
           </div>
        </div>

         <div style={{ position: 'absolute', top: 30, left: 30, fontSize: 40, fontWeight: 900, color: '#C084FC', textShadow: '2px 2px 0px black' }}>
           ForkLens
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}