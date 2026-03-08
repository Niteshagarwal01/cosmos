import { useState } from 'react'

export default function DevGuide() {
  const [activeStep, setActiveStep] = useState('01')
  const steps = [
    {
      n: '01',
      title: 'Clone + Boot',
      color: '#c8ff00',
      sub: 'One command cold-start via Docker Compose. All five services — API gateway, three sim workers, and Redis broker — are healthy within ~18 seconds. No manual env setup required.',
      what: ['docker compose up --build', 'Exposes UI on :5173, API on :8000', 'OpenAPI docs auto-generated at /docs', 'Redis broker started on :6379'],
      code: `# Prerequisites: Docker ≥ 24, Node ≥ 20, Git
git clone https://github.com/cosmoslab/cosmoslab.git
cd cosmoslab
cp .env.example .env          # edit REDIS_URL if needed
docker compose up --build     # pulls images, ~90 s first run

# Services started on:
#  UI          http://localhost:5173
#  API Gateway http://localhost:8000
#  Redis       localhost:6379
#  Docs        http://localhost:8000/docs`,
    },
    {
      n: '02',
      title: 'Run a Pandemic Simulation',
      color: '#3d7fff',
      sub: 'POST a JSON scenario to /run. Specify engine, parameters, duration, optional coupling targets, and a seed for reproducibility. Returns a run_id and WebSocket URL immediately.',
      what: ['202 Accepted in < 20 ms', 'run_id + WebSocket URL in response', 'Coupling field links to ecosystem/evolution', 'Seed ensures deterministic replay'],
      code: `# Submit a scenario via HTTP
curl -X POST http://localhost:8000/run \\
  -H "Content-Type: application/json" \\
  -d '{
    "engine": "pandemic",
    "params": { "beta": 0.35, "gamma": 0.1,
                "N": 1000000, "I0": 50,
                "vaccination_rate": 0.002 },
    "duration": 365,
    "coupling": ["ecosystem"],
    "seed": 42
  }'

# Response (202 Accepted):
# { "run_id": "r_7f3a2c", "ws": "/ws/stream/r_7f3a2c" }`,
    },
    {
      n: '03',
      title: 'Stream Ticks via WebSocket',
      color: '#ff9f3d',
      sub: 'Connect to the WebSocket URL from step 02. The server pushes per-tick state at up to 60 fps — each message contains the full state vector, effective R₀, and any cross-domain events fired that tick.',
      what: ['~16 ms between messages at 60 fps', 'Full S/I/R state in every tick', 'R0_eff computed live each tick', 'events[] carries coupling triggers'],
      code: `# Connect to the tick stream (wscat or browser)
wscat -c ws://localhost:8000/ws/stream/r_7f3a2c

# Each message ~every 16 ms (0.1 sim-time units):
{
  "run_id": "r_7f3a2c",
  "tick":   142,
  "t":      14.2,
  "engine": "pandemic",
  "state":  { "S": 942100, "I": 47831,
              "R": 10069,  "V": 0 },
  "R0_eff": 1.83,
  "events": []
}`,
    },
    {
      n: '04',
      title: 'Inject a Mid-Run Mutation Event',
      color: '#00d084',
      sub: 'PATCH any parameter mid-run without stopping the simulation. The change applies from the next tick. If the run is coupled, the coupling engine automatically propagates the event to linked engines.',
      what: ['Applies from very next RK4 tick', 'Works while WebSocket clients are streaming', 'Coupled engines notified automatically', 'Supports any param in original schema'],
      code: `# Simulate a variant appearing at t=120
curl -X PATCH http://localhost:8000/run/r_7f3a2c/params \\
  -H "Content-Type: application/json" \\
  -d '{
    "beta": 0.58,
    "gamma": 0.09,
    "note": "Delta-like variant at t=120"
  }'

# 202 Accepted — applies from next tick
# Coupling engine automatically notifies
# ecosystem worker if coupled`,
    },
    {
      n: '05',
      title: 'Export a Reproducible Scenario',
      color: '#ff3d7f',
      sub: 'Download the full run as a JSONL file — one metadata header, then one line per tick. Replay it on any machine with the same seed and get bit-identical output. Use as a citation fingerprint in research papers.',
      what: ['JSONL: one tick per line, streamable', 'Metadata line 0: params + seed + engine', 'Replay via POST /replay — deterministic', 'SHA-256 hash for citation fingerprint'],
      code: `# Download full scenario file (JSONL)
curl http://localhost:8000/run/r_7f3a2c/export \\
  > scenario_r_7f3a2c.jsonl

# Replay on any machine:
curl -X POST http://localhost:8000/replay \\
  -F "file=@scenario_r_7f3a2c.jsonl"

# File format — one JSON object per line:
# Line 0: scenario metadata + params + seed
# Line 1..N: tick payloads (identical to WS msgs)`,
    },
  ]

  return (
    <section id="devguide" style={{ position: 'relative', padding: '0', background: '#000' }}>
      <div className="fade-in" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '20px', padding: '22px 80px', borderTop: '1px solid #161616', borderBottom: '1px solid #161616', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, height: '2px', width: '100%', background: 'linear-gradient(90deg, transparent 0%, #c8ff00 50%, transparent 100%)', animation: 'scanBar 3s ease-in-out infinite' }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#c8ff0088', letterSpacing: '0.25em', textTransform: 'uppercase', textShadow: '0 0 12px #c8ff0055' }}>07 — Developer Guide</span>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #c8ff0022, transparent)' }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#333', letterSpacing: '0.2em' }}>FROM CLONE TO LIVE SIM IN 4 MIN</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start', marginBottom: '0', padding: '60px 80px' }}>
        <div className="fade-in">
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(3.5rem, 6vw, 6.5rem)', lineHeight: 0.88, letterSpacing: '-0.03em', color: '#e8e6e3', margin: '0 0 28px 0' }}>
            FROM ZERO<br />TO SIM<br /><span style={{ color: '#c8ff00' }}>IN 4 min</span>
          </h2>
          <p className="glow-text" style={{ color: '#555', fontSize: '14px', lineHeight: 1.8, maxWidth: '440px' }}>
            The five steps below take you from a fresh clone to streaming live simulation ticks in your terminal. All infrastructure is Docker-managed — no Python virtualenvs, no Redis installs, no port conflicts.
          </p>
        </div>

        <div className="fade-in" style={{ background: '#070707', border: '1px solid #1a1a1a', padding: '24px' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#444', letterSpacing: '0.2em', marginBottom: '16px' }}>QUICK METRICS</div>
          {[
            { label: 'Cold boot time',        value: '~18 s',    note: 'docker compose up (images warm)' },
            { label: 'Hot HMR reload',         value: '< 200 ms', note: 'Vite ESM transform' },
            { label: 'First tick latency',     value: '< 80 ms',  note: 'POST /run → first WS message' },
            { label: 'Tick throughput',        value: '60 fps',   note: 'WS push from Redis sub' },
            { label: 'Gzip bundle size',       value: '380 kB',   note: 'Vite production build' },
            { label: 'Scenario replay fidelity', value: '100%',   note: 'deterministic with fixed seed' },
          ].map(({ label, value, note }) => (
            <div key={label} className="row-item" style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'start', padding: '10px 0', borderBottom: '1px solid #0f0f0f' }}>
              <div>
                <div className="glow-text" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#555' }}>{label}</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#333', marginTop: '2px' }}>{note}</div>
              </div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', color: '#c8ff00', whiteSpace: 'nowrap' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Step tabs row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1px', background: '#1c1c1c', marginBottom: '1px' }}>
        {steps.map(({ n, title, color }) => (
          <button key={n} onClick={() => setActiveStep(n)} style={{
            border: 'none', cursor: 'pointer', textAlign: 'left',
            padding: '20px 24px',
            background: activeStep === n ? color + '0e' : '#090909',
            borderBottom: activeStep === n ? `2px solid ${color}` : '2px solid transparent',
            transition: 'all 0.15s',
          }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '22px', fontWeight: 700, color: activeStep === n ? color : '#1c1c1c', lineHeight: 1, marginBottom: '6px' }}>{n}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '12px', color: activeStep === n ? '#e8e6e3' : '#444', lineHeight: 1.35 }}>{title}</div>
          </button>
        ))}
      </div>

      {/* Content panel — balanced 1fr 1fr */}
      <div key={activeStep} className="tab-panel" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#1c1c1c' }}>

        {/* LEFT — step description */}
        <div style={{ background: '#060606', padding: '40px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {(() => {
            const { n, title, color, sub, what } = steps.find(s => s.n === activeStep)
            return (
              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color, letterSpacing: '0.25em', marginBottom: '20px', opacity: 0.7 }}>STEP {n}</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#e8e6e3', marginBottom: '24px' }}>{title}</div>
                <p className="glow-text" style={{ fontSize: '14px', color: '#555', lineHeight: 1.85, marginBottom: '32px' }}>{sub}</p>
                <div style={{ borderTop: '1px solid #111', paddingTop: '24px' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#444', letterSpacing: '0.2em', marginBottom: '16px' }}>WHAT THIS DOES</div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {what.map(w => (
                      <li key={w} className="row-item" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <span style={{ color, fontSize: '10px', marginTop: '3px', flexShrink: 0 }}>&#9658;</span>
                        <span className="glow-text" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#444', lineHeight: 1.6 }}>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })()}
        </div>

        {/* RIGHT — code panel */}
        {(() => {
          const { n, title, color, code } = steps.find(s => s.n === activeStep)
          return (
            <div style={{ background: '#030303', padding: '40px 40px' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#444', letterSpacing: '0.25em', marginBottom: '24px' }}>
                TERMINAL
              </div>
              <div className="code-scroll-wrap">
              <pre style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12.5px', lineHeight: 1.85, margin: 0, overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {code.split('\n').map((line, i) => {
                  const isComment = line.trim().startsWith('#')
                  const isCmd     = /^(curl|docker|git|cd|cp|wscat)\b/.test(line.trim())
                  const isKey     = /^["{]/.test(line.trim())
                  return (
                    <span key={i} style={{ display: 'block', color: isCmd ? '#e8e6e3' : isComment ? '#2d2d2d' : isKey ? '#666' : '#505050' }}>
                      {line || '\u00a0'}
                    </span>
                  )
                })}
              </pre>
              </div>
            </div>
          )
        })()}
      </div>
    </section>
  )
}
