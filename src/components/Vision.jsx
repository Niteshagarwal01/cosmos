export default function Vision() {
  const principles = [
    { id: 'P1', title: 'Unified ODE Core',        desc: 'A single RK4 solver handles all three domains. Whether the state vector is [S,I,R], [prey,predator], or [A,a], the integration loop is identical — reducing 45k LOC of duplicated code to one 600-line module.' },
    { id: 'P2', title: 'Event-Driven Coupling',   desc: 'Simulations emit typed events on a Redis pub/sub channel (HOST_CRASH, PATHOGEN_MUTATION, EXTINCTION_THRESHOLD). Any engine subscribes and reacts in the same timestep — true bi-directional coupling without polling.' },
    { id: 'P3', title: 'Live Introspection API',  desc: 'A WebSocket endpoint streams the full state tensor at every tick — up to 60 fps in the browser. Clients can pause, rewind 500 steps, or inject parameter perturbations mid-run and watch the trajectory diverge in real time.' },
    { id: 'P4', title: 'Portable Scenario Format',desc: 'Scenarios are serialised as deterministic JSON (engine, params, seed, event-timeline). Any simulation reproduces on any machine by replaying the file — addressing the reproducibility crisis in computational biology.' },
    { id: 'P5', title: 'Zero-Config Deployment',  desc: 'The full stack — three sim workers, API gateway, Redis broker, UI — runs with one Docker Compose command. No manual env setup. Median onboarding time in testing: 4 minutes.' },
    { id: 'P6', title: 'Open Extension Model',    desc: 'Every engine is a standalone Python class with a 5-method interface: init(), step(), state(), inject(), reset(). Add a custom model by dropping a file in /engines/ — no wiring required, auto-discovered at startup.' },
  ]

  const formula = `# Generalised system  ─ all 3 domains
#
# dX/dt = f(X, θ, t) + ε(t)
#
# X  ─ state vector        θ  ─ params
# ε  ─ stochastic noise N(0, σ²)
#
# ──────────────────────────────
# Pandemic   X = [S, I, R, V]
#   dS/dt = -β·S·I/N + ω·V
#   dI/dt =  β·S·I/N - γ·I
#
# Ecosystem  X = [H, P, K]
#   dH/dt =  r·H·(1 - H/K) - α·H·P
#   dP/dt =  δ·α·H·P - μ·P
#
# Evolution  X = [p, q]  p+q=1
#   Δp = p·(w̄_A - w̄) / w̄
#
# ──────────────────────────────
# Coupling  (cross-domain events)
#   HOST_CRASH  →  dS/dt += -k·(1-H/K₀)
#   MUTATION    →  β(t) = β₀·e^(Δfitness)`

  return (
    <section id="vision" style={{ padding: '0', background: '#000' }}>

      {/* Section label bar — flush to edges, no padding-top */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '22px 80px', borderBottom: '1px solid #161616', borderTop: '1px solid #161616' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#555', letterSpacing: '0.25em' }}>02 — Vision</span>
        <div style={{ flex: 1, height: '1px', background: '#161616' }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#2a2a2a', letterSpacing: '0.2em' }}>UNIFIED CROSS-DOMAIN SIMULATION</span>
      </div>

      {/* Main body: formula left, principles right — no wasted space */}
      <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: '1px', background: '#0d0d0d' }}>

        {/* LEFT: compact heading + formula */}
        <div style={{ background: '#020202', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '40px 44px 32px', borderBottom: '1px solid #0d0d0d' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(2.2rem, 3.5vw, 3.5rem)', lineHeight: 0.92, letterSpacing: '-0.03em', color: '#e8e6e3', margin: '0 0 14px 0' }}>
              ONE SOLVER<br /><span style={{ color: '#c8ff00' }}>ALL DOMAIN</span>
            </h2>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#2a2a2a', lineHeight: 1.7, margin: 0 }}>
              Every biological sim is a special case of the same generalised ODE. We prove it by running all three from one solver.
            </p>
          </div>
          <div className="fade-in" style={{ padding: '32px 44px', flex: 1 }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#c8ff00', letterSpacing: '0.25em', marginBottom: '18px', opacity: 0.5 }}>GENERALISED SYSTEM</div>
            <pre style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', lineHeight: 1.9, margin: 0, whiteSpace: 'pre' }}>
              {formula.split('\n').map((line, i) => {
                const isKey    = /dX|dS|dI|dR|dH|dP|Δp|w̄|HOST|MUTATION/.test(line)
                const isRule   = line.startsWith('# ─')
                const isHeader = line.startsWith('#') && !isRule
                return (
                  <span key={i} style={{ display: 'block', color: isKey ? '#c8ff00' : isRule ? '#1a1a1a' : isHeader ? '#252525' : '#3d3d3d' }}>
                    {line}
                  </span>
                )
              })}
            </pre>
          </div>
        </div>

        {/* RIGHT: two description paras + 2×3 principles grid */}
        <div style={{ background: '#040404', display: 'flex', flexDirection: 'column' }}>
          <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#0d0d0d', borderBottom: '1px solid #0d0d0d' }}>
            <div style={{ background: '#060606', padding: '36px 36px' }}>
              <p style={{ color: '#666', lineHeight: 1.85, fontSize: '14px', margin: 0 }}>
                The coupling layer is the novel contribution. When an ecosystem HOST_CRASH event fires, it mutates the susceptible-population parameter inside the active SIR model — in real time, same timestep. No post-hoc analysis.
              </p>
            </div>
            <div style={{ background: '#050505', padding: '36px 36px' }}>
              <p style={{ color: '#444', lineHeight: 1.85, fontSize: '14px', margin: 0 }}>
                Pandemic spread, predator–prey oscillation, and allele fixation are all solutions to coupled non-linear ODEs. The math is identical. Only the variable names differ.
              </p>
            </div>
          </div>

          {/* 2×3 principles grid — tight, dense */}
          <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#0d0d0d', flex: 1 }}>
            {principles.map(({ id, title, desc }) => (
              <div key={id} style={{ background: '#050505', padding: '28px 32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#c8ff00', letterSpacing: '0.15em', opacity: 0.6 }}>{id}</span>
                  <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', color: '#c8c6c3' }}>{title}</span>
                </div>
                <p style={{ fontSize: '12px', color: '#444', lineHeight: 1.7, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
