// app/api/og/route.tsx
import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const repo = searchParams.get('repo') || 'unknown/repo';
  const active = searchParams.get('active') || '?';
  const total = searchParams.get('total') || '?';
 
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FDF4FF', // Your Purple Theme
          border: '20px solid black',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
           {/* Fork Icon (Simulated with text for simplicity in OG) */}
           <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M12 18v-7" />
             <path d="M18 7v4a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7" />
             <circle cx="12" cy="18" r="3" />
             <circle cx="6" cy="6" r="3" />
             <circle cx="18" cy="6" r="3" />
           </svg>
           <span style={{ fontSize: 60, fontWeight: 900, marginLeft: 20, color: 'black' }}>ForkLens</span>
        </div>

        <div style={{ fontSize: 40, color: '#4b5563', marginBottom: 10 }}>Repository Analysis</div>
        <div style={{ fontSize: 80, fontWeight: 'bold', color: 'black', marginBottom: 40 }}>
          {repo}
        </div>

        <div style={{ display: 'flex', gap: '40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#dcfce7', padding: '20px 40px', border: '4px solid black', borderRadius: '20px' }}>
             <span style={{ fontSize: 60, fontWeight: 'bold', color: '#166534' }}>{active}</span>
             <span style={{ fontSize: 24, fontWeight: 'bold', color: '#166534' }}>Active Forks</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'white', padding: '20px 40px', border: '4px solid black', borderRadius: '20px' }}>
             <span style={{ fontSize: 60, fontWeight: 'bold', color: 'black' }}>{total}</span>
             <span style={{ fontSize: 24, fontWeight: 'bold', color: 'black' }}>Total Forks</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}