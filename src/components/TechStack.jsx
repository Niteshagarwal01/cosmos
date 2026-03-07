export default function TechStack() {
  const groups = [
    {
      label: 'Simulation Core',
      color: '#00d084',
      items: [
        { name: 'Python 3.12',  role: 'Runtime — workers + coupler',   why: 'asyncio native, numpy vectorised RK4, fastest prototyping for ODEs' },
        { name: 'NumPy 1.26',   role: 'Numerical integration arrays',   why: 'BLAS-backed; integrating 4 state vars × 10k steps in ~12 ms' },
        { name: 'SciPy',        role: 'ODE solver fallback (solve_ivp)', why: 'Adaptive step-size control for stiff Jacobians in evolution model' },
        { name: 'Pydantic v2',  role: 'Scenario / param validation',    why: 'Rust-backed parser; zero-cost strict typing at API boundary' },
      ],
    },
    {
      label: 'Infrastructure',
      color: '#3d7fff',
      items: [
        { name: 'FastAPI 0.111', role: 'HTTP + WebSocket gateway',       why: 'Async-first; native WS support; auto OpenAPI docs at /docs' },
        { name: 'Uvicorn',       role: 'ASGI production server',         why: 'Libuv event loop; 40k req/s on a 4-core machine in benchmarks' },
        { name: 'Redis 7.2',     role: 'Pub/sub broker + task queue',    why: 'Sub-millisecond pub/sub latency; streams API for tick replay' },
        { name: 'Docker Compose',role: '5-service orchestration',        why: 'One command cold-start: docker compose up — all services healthy in ~18 s' },
      ],
    },
    {
      label: 'Visualisation',
      color: '#c8ff00',
      items: [
        { name: 'React 18',      role: 'UI component tree',              why: 'Concurrent rendering; startTransition keeps canvas smooth during WS bursts' },
        { name: 'Canvas 2D API', role: '60 fps simulation render',       why: 'Chosen over WebGL — ODE line charts need 2D not depth buffer; smaller GPU overhead' },
        { name: 'Vite 5',        role: 'Dev server + bundler',           why: 'HMR in <200 ms; ESM-native; production bundle 380 kB gzipped' },
        { name: 'Tailwind 3',    role: 'Utility-first CSS',              why: 'Design-token discipline; no runtime style recalculation' },
      ],
    },
    {
      label: 'Analysis & Export',
      color: '#ff9f3d',
      items: [
        { name: 'NetworkX',      role: 'Graph-based contact networks',   why: 'SIR on scale-free Barabási-Albert graphs; degree distribution preserving' },
        { name: 'pandas',        role: 'Tick-series aggregation',        why: 'DataFrame resampling for R₀ and peak-I calculation from raw ticks' },
        { name: 'Matplotlib',    role: 'Export-quality figures',         why: 'PDF/SVG export of reproducible scenario outputs for papers' },
        { name: 'JSON Lines',    role: 'Portable scenario format',       why: 'Append-only, streamable; one line per tick — git-diffable scenario files' },
      ],
    },
  ]

  return (
    <section id="techstack" style={{ position: 'relative', padding: '0', background: '#000' }}>
      {/* Tiny inline header — nothing like a traditional section heading */}
      <div className="fade-in" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '22px 80px', borderTop: '1px solid #161616', borderBottom: '1px solid #161616', marginBottom: '0' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#555', letterSpacing: '0.25em' }}>05 — Tech Stack</span>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.25rem', color: '#e8e6e3', letterSpacing: '-0.01em' }}>TECH STACK</span>
        <div style={{ flex: 1, height: '1px', background: '#161616', alignSelf: 'center' }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#2a2a2a', letterSpacing: '0.15em' }}>16 DEPS · 0 FOR PRESTIGE</span>
      </div>

      {/* 2×2 group panels */}
      <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#0e0e0e' }}>
        {groups.map(({ label, color, items }) => (
          <div key={label} style={{ background: '#040404', overflow: 'hidden' }}>
            {/* Group header */}
            <div style={{ padding: '28px 36px 20px', borderBottom: `1px solid ${color}33`, overflow: 'hidden' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.6rem, 2.2vw, 2.6rem)', color: '#111', lineHeight: 0.92, marginBottom: '10px', letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label.toUpperCase()}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '16px', height: '2px', background: color }} />
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color, letterSpacing: '0.2em', opacity: 0.7 }}>{items.length} PACKAGES</span>
              </div>
            </div>
            {/* Item rows — 3-col: name | role | why */}
            {items.map(({ name, role, why }) => (
              <div key={name} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '0', borderBottom: '1px solid #080808' }}>
                {/* Name + role cell */}
                <div style={{ padding: '14px 20px 14px 36px', borderRight: '1px solid #0d0d0d' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color, marginBottom: '4px', whiteSpace: 'nowrap' }}>{name}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#333', lineHeight: 1.5 }}>{role}</div>
                </div>
                {/* Why cell */}
                <div style={{ padding: '14px 28px', fontSize: '11px', color: '#3a3a3a', lineHeight: 1.7 }}>{why}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
