export default function Roadmap() {
  const phases = [
    {
      id: 'P1', num: '01',
      title: 'Foundation',
      status: 'COMPLETE',
      statusColor: '#c8ff00',
      period: 'Week 1–2',
      pct: 100,
      summary: 'Core integrator, API gateway, Redis pipeline, and React canvas renderer all running in Docker.',
      items: [
        { done: true,  text: 'RK4 solver — SIR, Lotka-Volterra, Fisher-Wright from single entrypoint' },
        { done: true,  text: 'Pydantic scenario schema v1.0 — engine + params + seed + duration' },
        { done: true,  text: 'FastAPI: POST /run · GET /run/{id} · WebSocket /ws/stream/{id}' },
        { done: true,  text: 'Redis pub/sub tick pipeline — pandemic worker at 60 fps' },
        { done: true,  text: 'React canvas renderer — real-time S/I/R chart from WS stream' },
        { done: true,  text: 'Docker Compose 5-service stack: api · 3×workers · redis' },
      ],
    },
    {
      id: 'P2', num: '02',
      title: 'Cross-Domain Coupling',
      status: 'IN PROGRESS',
      statusColor: '#ff9f3d',
      period: 'Week 3–5',
      pct: 33,
      summary: 'Coupling engine routes events between running simulations. Mid-run parameter injection lets researchers model shocks live.',
      items: [
        { done: true,  text: 'coupling_rules.yaml — event-to-param-mutation format finalised' },
        { done: true,  text: 'Coupling daemon — routes HOST_CRASH and MUTATION cross-domain events' },
        { done: false, text: 'PATCH /run/{id}/params — mid-run injection endpoint (in review)' },
        { done: false, text: 'Ecosystem worker — Lotka-Volterra + Rosenzweig-MacArthur models' },
        { done: false, text: 'Evolution worker — Wright-Fisher drift + natural selection' },
        { done: false, text: 'Coupled demo: pandemic + ecosystem running simultaneously' },
      ],
    },
    {
      id: 'P3', num: '03',
      title: 'Reproducibility',
      status: 'PLANNED',
      statusColor: '#6fa3ff',
      period: 'Week 6–7',
      pct: 0,
      summary: 'Every run becomes a citable, replayable artifact. Bit-identical output from any seed on any machine.',
      items: [
        { done: false, text: 'GET /run/{id}/export — JSONL tick log + scenario header' },
        { done: false, text: 'POST /replay — deterministic replay from exported file' },
        { done: false, text: 'Scenario library — 10 canonical scenarios (1918 flu, wolf-elk, malaria)' },
        { done: false, text: 'PDF/SVG figure export from any completed run' },
        { done: false, text: 'Run hash — SHA-256 of scenario JSON for citation fingerprint' },
      ],
    },
    {
      id: 'P4', num: '04',
      title: 'Scale & Polish',
      status: 'PLANNED',
      statusColor: '#bbbbbb',
      period: 'Week 8–10',
      pct: 0,
      summary: 'Performance hardening, network SIR on real contact graphs, and a full 3-panel linked view at 60 fps.',
      items: [
        { done: false, text: 'WebWorker RK4 offload to SharedArrayBuffer thread in browser' },
        { done: false, text: 'NetworkX SIR — Barabási-Albert + Watts-Strogatz graph modes' },
        { done: false, text: '3-panel linked view: pandemic / ecosystem / evolution at 60 fps' },
        { done: false, text: 'Benchmark suite: 10k-agent SIR < 200 ms · 365-tick coupled run < 1 s' },
        { done: false, text: 'LaTeX table export: R₀, peak-I, equilibrium from any run' },
        { done: false, text: 'OpenAPI docs QA pass — every endpoint with full request/response examples' },
      ],
    },
  ]

  return (
    <section id="roadmap" style={{ position: 'relative', padding: '0', background: '#000' }}>

      {/* Label bar */}
      <div className="fade-in" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '20px', padding: '22px 80px', borderTop: '1px solid #161616', borderBottom: '1px solid #161616', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, height: '2px', width: '100%', background: 'linear-gradient(90deg, transparent 0%, #c8ff00 50%, transparent 100%)', animation: 'scanBar 3s ease-in-out infinite' }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#c8ff0088', letterSpacing: '0.25em', textTransform: 'uppercase', textShadow: '0 0 12px #c8ff0055' }}>08 — Roadmap</span>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #c8ff0022, transparent)' }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#333', letterSpacing: '0.2em' }}>10-WEEK SHIP PLAN · 4 PHASES</span>
      </div>

      {/* Circuit trace timeline */}
      <div className="fade-in" style={{ padding: '20px 80px 0' }}>
        <div className="circuit-trace" />
      </div>

      {/* Phase chapters — each one a full-width horizontal band */}
      <div className="fade-in stagger-reveal">
        {phases.map(({ id, num, title, status, statusColor, period, pct, summary, items }) => (
          <div key={id} className="phase-band" style={{ borderBottom: '1px solid #111', position: 'relative', overflow: 'hidden' }}>

            {/* Watermark number */}
            <div style={{
              position: 'absolute', right: '60px', top: '50%', transform: 'translateY(-50%)',
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: 'clamp(7rem, 12vw, 13rem)',
              lineHeight: 1, letterSpacing: '-0.05em',
              color: statusColor, opacity: 0.04,
              pointerEvents: 'none', userSelect: 'none',
            }}>{num}</div>

            {/* Header row */}
            <div style={{
              display: 'grid', gridTemplateColumns: '80px 1fr auto',
              gap: '0', borderBottom: '1px solid #0d0d0d',
              background: `${statusColor}06`,
            }}>
              {/* Phase ID pill */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRight: `2px solid ${statusColor}`,
                padding: '20px 0',
              }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: statusColor, letterSpacing: '0.2em', writingMode: 'vertical-rl', textOrientation: 'mixed' }}>P{num}</span>
              </div>

              {/* Title + summary */}
              <div style={{ padding: '20px 40px', display: 'flex', alignItems: 'center', gap: '40px' }}>
                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.2rem, 1.8vw, 1.7rem)', color: '#e8e6e3', letterSpacing: '-0.02em', marginBottom: '4px' }}>{title}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#444', letterSpacing: '0.05em' }}>{period}</div>
                </div>
                <p className="glow-text" style={{ fontSize: '12px', color: '#444', lineHeight: 1.7, maxWidth: '420px', margin: 0, flexShrink: 1 }}>{summary}</p>
              </div>

              {/* Status + progress */}
              <div style={{ padding: '20px 48px 20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: '10px', minWidth: '160px' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: statusColor, letterSpacing: '0.2em', border: `1px solid ${statusColor}44`, padding: '3px 10px' }}>{status}</span>
                <div style={{ width: '100px', height: '2px', background: '#111', position: 'relative' }}>
                  <div className="progress-fill" style={{ background: statusColor, width: `${pct}%` }} />
                </div>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: pct === 100 ? statusColor : '#333' }}>{pct}% done</span>
              </div>
            </div>

            {/* Deliverables — 2-col grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0' }}>
              {/* Left accent stripe */}
              <div style={{ borderRight: `1px solid ${statusColor}22`, background: `${statusColor}03` }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#0a0a0a', margin: '1px 0 0 0' }}>
                {items.map(({ done, text }) => (
                  <div key={text} className="row-item" style={{
                    display: 'flex', gap: '12px', alignItems: 'flex-start',
                    padding: '14px 32px',
                    background: done ? '#050505' : '#020202',
                  }}>
                    <span
                      style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: done ? statusColor : '#3a3a3a', flexShrink: 0, marginTop: '2px' }}
                      className={done ? 'check-done' : ''}
                    >{done ? '✓' : '○'}</span>
                    <span className="glow-text" style={{ fontSize: '12px', color: done ? '#888' : '#555', lineHeight: 1.65 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

    </section>
  )
}

    