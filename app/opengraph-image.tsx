import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ForkLens'; // Updated to your project name
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#C084FC',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{
          display: 'flex',
          padding: '40px',
          borderRadius: '50px',
          border: '15px solid white',
          backgroundColor: '#C084FC',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
           {/* Massive SVG for Social Preview */}
           <svg
            xmlns="http://www.w3.org/2000/svg"
            width="200"
            height="200"
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="3" 
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="18" r="3" />
            <circle cx="6" cy="6" r="3" />
            <circle cx="18" cy="6" r="3" />
            <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9" />
            <path d="M12 12v3" />
          </svg>
        </div>
        <h1 style={{ fontSize: '80px', color: 'black', marginTop: '40px', fontWeight: 'bold' }}>
          ForkLens
        </h1>
      </div>
    ),
    { ...size }
  );
}