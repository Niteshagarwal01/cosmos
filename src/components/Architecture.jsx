export default function Architecture() {
  const layers = [
    {
      id: '00',
      name: 'Browser Client',
      tech: 'React 18 + Vite 5',
      color: '#c8ff00',
      desc: 'Renders canvas at 60 fps via requestAnimationFrame. Subscribes to /ws/stream — receives per-tick JSON blobs and updates a shared Float64Array via SharedArrayBuffer for zero-copy rendering.',
      detail: 'WS message: { tick, engine, state: Float64Array, events: [...] }',
    },
    {
      id: '01',
      name: 'API Gateway',
      tech: 'FastAPI 0.111 + Uvicorn',
      color: '#3d7fff',
      desc: 'Handles HTTP scenario submission (POST /run), WebSocket upgrade (/ws/stream), and mid-run parameter injection (PATCH /run/{id}/params). Validates payloads with Pydantic v2 models.',
      detail: 'POST /run  →  202 Accepted  +  { run_id: "abc123" }',
    },
    {
      id: '02',
      name: 'Message Broker',
      tech: 'Redis 7.2  pub/sub',
      color: '#ff9f3d',
      desc: 'Each running simulation publishes to cosmoslab:run:{id}:ticks. The cross-domain coupler subscribes to all active runs and forwards coupling events between engines within the same Redis event loop iteration (< 0.5 ms latency).',
      detail: 'Channel: cosmoslab:run:abc123:ticks  →  fan-out to WS & coupler',
    },
    {
      id: '03',
      name: 'Simulation Workers',
      tech: 'Python asyncio workers',
      color: '#00d084',
      desc: 'Three stateless workers (pandemic_worker.py, ecosystem_worker.py, evolution_worker.py) pull scenario configs from the Redis task queue, run the RK4 integrator, and publish tick payloads. Each worker runs in its own subprocess — crash-isolated.',
      detail: 'RK4 dt=0.01, state published every 10 ticks (0.1 sim-time)',
    },
    {
      id: '04',
      name: 'Coupling Engine',
      tech: 'Event mapper + param injector',
      color: '#ff3d7f',
      desc: 'Stateless service that maps cross-domain events to parameter mutations. E.g. HOST_CRASH(severity=0.6) → pandemic_worker.inject({ beta: beta0 * 0.6, N: N * 0.7 }). Mappings are fully configurable in coupling_rules.yaml.',
      detail: 'coupling_rules.yaml: on HOST_CRASH → set pandemic.N *= (1 - severity)',
    },
  ]

  const flow = [
    { from: 'Browser',            to: 'API Gateway',          label: 'POST /run  (scenario JSON)', color: '#c8ff00' },
    { from: 'API Gateway',        to: 'Redis Task Queue',     label: 'LPUSH cosmoslab:queue', color: '#3d7fff' },
    { from: 'Sim Workers (×3)',   to: 'Redis tick channel',   label: 'PUBLISH tick payload', color: '#00d084' },
    { from: 'Coupling Engine',    to: 'Sim Workers',          label: 'PATCH params (inject)', color: '#ff3d7f' },
    { from: 'Redis tick channel', to: 'API Gateway WS',       label: 'SUBSCRIBE → fan-out', color: '#ff9f3d' },
    { from: 'API Gateway WS',     to: 'Browser',              label: 'WS push  60 fps', color: '#c8ff00' },
  ]

  return (
    <section id="architecture" style={{ position: 'relative', padding: '0', background: '#000' }}>
      {/* Identity bar */}
      <div className="fade-in" style={{ display: 'flex', alignItems: 'center', padding: '22px 80px', borderBottom: '1px solid #161616', borderTop: '1px solid #161616' }}>
        <span className="type-label" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#555', letterSpacing: '0.25em', textTransform: 'uppercase' }}>04 — Architecture</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: '#1c1c1c', letterSpacing: '-0.02em' }}>5-LAYER EVENT MESH</span>
        <div style={{ marginLeft: '32px', display: 'flex', gap: '20px' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#1a1a1a' }}>stateless</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#1a1a1a' }}>crash-recoverable</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#1a1a1a' }}>redis-sourced</span>
        </div>
      </div>

      {/* Vertical pipeline — each layer is a full-width row with a HUGE layer ID */}
      <div className="fade-in">
        {layers.map(({ id, name, tech, color, desc, detail }, idx) => (
          <div key={id} className="row-item arch-layer" style={{ display: 'grid', gridTemplateColumns: '160px 320px 1fr 1fr', gap: '1px', background: '#0c0c0c', borderBottom: '1px solid #0c0c0c' }}>
            {/* Giant layer ID */}
            <div style={{ background: idx % 2 === 0 ? '#030303' : '#040404', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '140px', position: 'relative', overflow: 'hidden' }}>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(5rem, 7vw, 8rem)', color: '#0d0d0d', lineHeight: 1, userSelect: 'none' }}>{id}</span>
              <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', width: '24px', height: '2px', background: color }} />
            </div>
            {/* Name + tech */}
            <div style={{ background: idx % 2 === 0 ? '#050505' : '#060606', padding: '32px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color, letterSpacing: '0.2em', marginBottom: '10px', opacity: 0.7 }}>LAYER {id}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.3rem, 2vw, 2rem)', color: '#e8e6e3', lineHeight: 1.15, marginBottom: '10px' }}>{name}</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#2a2a2a' }}>{tech}</div>
            </div>
            {/* Description */}
            <div style={{ background: idx % 2 === 0 ? '#040404' : '#050505', padding: '32px 36px', display: 'flex', alignItems: 'center' }}>
              <p className="glow-text" style={{ fontSize: '13px', color: '#4a4a4a', lineHeight: 1.75, margin: 0 }}>{desc}</p>
            </div>
            {/* Detail / command */}
            <div style={{ background: idx % 2 === 0 ? '#030303' : '#040404', padding: '32px 36px', display: 'flex', alignItems: 'center' }}>
              <div className="arch-detail" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9.5px', color, opacity: 0.35, lineHeight: 1.65, wordBreak: 'break-word' }}>{detail}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Data flow as a compact 3-col bar at the bottom */}
      <div className="fade-in" style={{ padding: '0 80px 80px' }}>
        <div style={{ marginTop: '1px', background: '#0c0c0c' }}>
          <div style={{ padding: '14px 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#0c0c0c' }}>
            {flow.map(({ from, to, label, color }) => (
              <div key={label} className="row-item" style={{ padding: '14px 20px', background: '#050505', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#333', flexShrink: 0, marginTop: '1px' }}>{from}</span>
                <span style={{ color, fontSize: '10px', flexShrink: 0, marginTop: '1px' }}>→</span>
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#2a2a2a' }}>{to}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8.5px', color, marginTop: '3px', opacity: 0.5 }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
