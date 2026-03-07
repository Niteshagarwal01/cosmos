export default function MobileBlock() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: '#000', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px', textAlign: 'center',
    }}>
      {/* Corner brackets */}
      {[[0,0,1,1],[1,0,-1,1],[0,1,1,-1],[1,1,-1,-1]].map(([rx,ry,sx,sy], i) => (
        <div key={i} style={{
          position: 'absolute',
          top:    ry ? 'auto' : '20px', bottom: ry ? '20px' : 'auto',
          left:   rx ? 'auto' : '20px', right:  rx ? '20px' : 'auto',
          width: '28px', height: '28px',
          borderTop:    sy > 0 ? '1px solid rgba(200,255,0,0.35)' : 'none',
          borderBottom: sy < 0 ? '1px solid rgba(200,255,0,0.35)' : 'none',
          borderLeft:   sx > 0 ? '1px solid rgba(200,255,0,0.35)' : 'none',
          borderRight:  sx < 0 ? '1px solid rgba(200,255,0,0.35)' : 'none',
        }} />
      ))}

      {/* Logo mark */}
      <div style={{
        width: '40px', height: '40px', background: '#c8ff00',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '32px',
      }}>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '16px', color: '#000' }}>CL</span>
      </div>

      <div style={{
        fontFamily: 'Syne, sans-serif', fontWeight: 800,
        fontSize: '2.2rem', lineHeight: 0.9,
        letterSpacing: '-0.03em', color: '#e8e6e3',
        marginBottom: '24px',
      }}>
        COS<span style={{ color: '#c8ff00' }}>MOS</span><br />LAB
      </div>

      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
        color: '#c8ff00', letterSpacing: '0.25em', textTransform: 'uppercase',
        marginBottom: '28px',
      }}>
        Desktop Only
      </div>

      <p style={{
        fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px',
        color: '#555', lineHeight: 1.75, maxWidth: '300px', marginBottom: '36px',
      }}>
        CosmosLab is a high-density simulation dashboard designed for desktop screens.
        Please open this on a laptop or desktop with a minimum viewport of 1024px.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
        {['PANDEMIC ENGINE', 'ECOSYSTEM ENGINE', 'EVOLUTION ENGINE'].map(m => (
          <div key={m} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '4px', height: '4px', background: '#c8ff00', display: 'inline-block' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#333', letterSpacing: '0.2em' }}>{m}</span>
          </div>
        ))}
      </div>

      <div style={{
        position: 'absolute', bottom: '20px',
        fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
        color: '#1c1c1c', letterSpacing: '0.2em',
      }}>
        COSMOSLAB — COMPLEX SYSTEMS SIMULATION — v2.0
      </div>
    </div>
  )
}
