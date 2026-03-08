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

      {/* Header bar */}
      <div className="fade-in" style={{
        display: 'flex', alignItems: 'center', gap: '20px',
        padding: '22px 64px',
        borderTop: '1px solid #161616', borderBottom: '1px solid #161616',
      }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#444', letterSpacing: '0.25em' }}>05 — TECH STACK</span>
        <div style={{ flex: 1, height: '1px', background: '#161616' }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#222', letterSpacing: '0.15em' }}>16 DEPS · 0 FOR PRESTIGE</span>
      </div>

      {/* One horizontal band per group — zero cross-column alignment issues */}
      {groups.map(({ label, index, color, items }, gi) => (
        <div
          key={label}
          className="fade-in"
          style={{
            display: 'grid',
            gridTemplateColumns: '220px 1fr',
            borderBottom: '1px solid #111',
          }}
        >
          {/* Left: group identity */}
          <div style={{
            padding: '32px 28px',
            borderRight: `1px solid ${color}22`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: '#040404',
          }}>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#333', letterSpacing: '0.2em', marginBottom: '12px' }}>{index}</div>
              <div style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: '22px',
                color: '#181818',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
              }}>{label}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '24px' }}>
              <div style={{ width: '20px', height: '2px', background: color }} />
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
                }}
              >
                {/* Accent dot */}
                <div style={{ width: '5px', height: '5px', background: color, opacity: 0.5 }} />
                {/* Name */}
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '12px',
                  color,
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                }}>{name}</div>
                {/* Role badge */}
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '9px',
                  color: '#333',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  borderLeft: `2px solid ${color}44`,
                  paddingLeft: '7px',
                }}>{role}</div>
                {/* Why */}
                <div style={{
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
