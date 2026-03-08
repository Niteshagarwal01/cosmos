export default function TechStack() {
  const groups = [
    {
      label: 'Simulation Core',
      index: '01',
      color: '#00d084',
      items: [
        { name: 'Python 3.12',  role: 'Runtime',         why: 'asyncio native, numpy vectorised RK4, fastest prototyping for ODEs' },
        { name: 'NumPy 1.26',   role: 'Integration',     why: 'BLAS-backed; 4 state vars × 10k steps in ~12 ms' },
        { name: 'SciPy',        role: 'ODE solver',      why: 'Adaptive step-size for stiff Jacobians in evolution model' },
        { name: 'Pydantic v2',  role: 'Validation',      why: 'Rust-backed parser; zero-cost strict typing at API boundary' },
      ],
    },
    {
      label: 'Infrastructure',
      index: '02',
      color: '#3d7fff',
      items: [
        { name: 'FastAPI 0.111', role: 'API gateway',    why: 'Async-first; native WS support; auto OpenAPI docs at /docs' },
        { name: 'Uvicorn',       role: 'ASGI server',    why: 'Libuv event loop; 40k req/s on a 4-core machine in benchmarks' },
        { name: 'Redis 7.2',     role: 'Pub/sub + queue',why: 'Sub-millisecond latency; streams API for tick replay' },
        { name: 'Docker Compose',role: 'Orchestration',  why: 'One command cold-start — all services healthy in ~18 s' },
      ],
    },
    {
      label: 'Visualisation',
      index: '03',
      color: '#c8ff00',
      items: [
        { name: 'React 18',      role: 'UI layer',       why: 'Concurrent rendering; startTransition keeps canvas smooth during WS bursts' },
        { name: 'Canvas 2D API', role: '60 fps render',  why: 'Chosen over WebGL — ODE charts need 2D not depth buffer' },
        { name: 'Vite 5',        role: 'Bundler',        why: 'HMR in <200 ms; ESM-native; bundle 380 kB gzipped' },
        { name: 'Tailwind 3',    role: 'CSS',            why: 'Design-token discipline; no runtime style recalculation' },
      ],
    },
    {
      label: 'Analysis & Export',
      index: '04',
      color: '#ff9f3d',
      items: [
        { name: 'NetworkX',      role: 'Graph networks', why: 'SIR on scale-free Barabási-Albert graphs; degree distribution preserving' },
        { name: 'pandas',        role: 'Aggregation',    why: 'DataFrame resampling for R₀ and peak-I from raw ticks' },
        { name: 'Matplotlib',    role: 'Figures',        why: 'PDF/SVG export of reproducible scenario outputs for papers' },
        { name: 'JSON Lines',    role: 'Format',         why: 'Append-only, streamable; one line per tick — git-diffable' },
      ],
    },
  ]

  return (
    <section id="techstack" style={{ position: 'relative', background: '#000' }}>

      {/* Header bar with animated scan line */}
      <div className="fade-in" style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', gap: '20px',
        padding: '22px 64px',
        borderTop: '1px solid #161616', borderBottom: '1px solid #161616',
        overflow: 'hidden',
      }}>
        {/* Animated lime scan bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0,
          height: '2px', width: '100%',
          background: 'linear-gradient(90deg, transparent 0%, #c8ff00 50%, transparent 100%)',
          animation: 'scanBar 3s ease-in-out infinite',
        }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#c8ff0088', letterSpacing: '0.25em', textTransform: 'uppercase', textShadow: '0 0 12px #c8ff0055' }}>05 — Tech Stack</span>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #c8ff0022, transparent)' }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#333', letterSpacing: '0.15em' }}>16 DEPS · 0 FOR PRESTIGE</span>
      </div>

      {/* One horizontal band per group */}
      {groups.map(({ label, index, color, items }, gi) => (
        <div
          key={label}
          className="fade-in"
          style={{
            display: 'grid',
            gridTemplateColumns: '260px 1fr',
            borderBottom: '1px solid #111',
            borderTop: `1px solid ${color}33`,
          }}
        >
          {/* Left: group identity with color glow */}
          <div style={{
            padding: '32px 28px',
            borderRight: `1px solid ${color}22`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: `radial-gradient(ellipse at 0% 50%, ${color}08 0%, transparent 70%), #040404`,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Vertical color bar on left edge */}
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '2px',
              background: `linear-gradient(to bottom, transparent, ${color}88, transparent)`,
            }} />
            <div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: `${color}55`, letterSpacing: '0.2em', marginBottom: '12px' }}>{index}</div>
              <div style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: '16px',
                color: color,
                lineHeight: 1.15,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                wordBreak: 'break-word',
                transition: 'color 0.3s, text-shadow 0.3s',
                textShadow: `0 0 18px ${color}55`,
              }}>{label}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '24px' }}>
              {/* Animated color bar */}
              <div style={{
                width: '20px', height: '2px', background: color,
                boxShadow: `0 0 8px ${color}`,
                animation: 'breathePulse 2s ease-in-out infinite',
              }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color, opacity: 0.6, letterSpacing: '0.15em' }}>
                {items.length} PKG
              </span>
            </div>
          </div>

          {/* Right: 4 item cards in a row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {items.map(({ name, role, why }, ii) => (
              <div
                key={name}
                className="row-item"
                style={{
                  padding: '28px 24px',
                  borderRight: ii < 3 ? '1px solid #0d0d0d' : 'none',
                  background: '#020202',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  transition: 'background 0.3s',
                }}
              >
                {/* Accent dot */}
                <div style={{
                  width: '5px', height: '5px', background: color,
                  boxShadow: `0 0 6px ${color}`,
                  animation: 'breathePulse 2s ease-in-out infinite',
                  animationDelay: `${ii * 0.2}s`,
                }} />
                {/* Name */}
                <div className="tech-name" style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '12px',
                  color,
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                  transition: 'text-shadow 0.3s',
                }}>{name}</div>
                {/* Role badge */}
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '9px',
                  color: '#333',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  borderLeft: `2px solid ${color}55`,
                  paddingLeft: '7px',
                  transition: 'border-color 0.3s, color 0.3s',
                }}>{role}</div>
                {/* Why */}
                <div className="glow-text" style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '11px',
                  color: '#3a3a3a',
                  lineHeight: 1.65,
                  marginTop: 'auto',
                  paddingTop: '6px',
                }}>{why}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

    </section>
  )
}
