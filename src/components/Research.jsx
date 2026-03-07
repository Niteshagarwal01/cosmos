const domains = [
  {
    id: 'pandemic',
    label: 'PANDEMIC',
    color: '#3d7fff',
    subtitle: 'SIR / SEIR Epidemics',
    stateVec: 'x = [S, E, I, R, V]ᵀ',
    paramVec: 'p = {β, γ, σ, μ, ν}',
    system: [
      { lhs: 'dS/dt',   rhs: '= −β·S·I/N  +  ν·V  −  μ·S',    lc: '#e8e6e3' },
      { lhs: 'dE/dt',   rhs: '=  β·S·I/N  −  σ·E',             lc: '#3d7fff' },
      { lhs: 'dI/dt',   rhs: '=  σ·E  −  γ·I  −  μᵢ·I',       lc: '#c8ff00' },
      { lhs: 'dR/dt',   rhs: '=  γ·I',                          lc: '#555'    },
    ],
    coupling: 'HOST_CRASH(s) → β *= (1+0.4s),  N *= (1−s)',
    insight: 'R₀ = β/γ — when > 1 the epidemic grows exponentially',
    ref: 'Kermack & McKendrick, 1927',
  },
  {
    id: 'ecosystem',
    label: 'ECOSYSTEM',
    color: '#00d084',
    subtitle: 'Lotka-Volterra ODEs',
    stateVec: 'x = [x₁, x₂, …, xₙ]ᵀ  (n species)',
    paramVec: 'p = {α, β, δ, γ, K, ε}',
    system: [
      { lhs: 'dx_prey/dt', rhs: '= α·x_prey·(1−x_prey/K)  −  β·x_prey·x_pred', lc: '#00d084' },
      { lhs: 'dx_pred/dt', rhs: '= δ·x_prey·x_pred  −  γ·x_pred  −  ε·stress',  lc: '#e8e6e3' },
      { lhs: 'dK/dt',      rhs: '= −ξ·PATHOGEN_PRESSURE(t)',                      lc: '#555'    },
    ],
    coupling: 'PATHOGEN(β, N) → K *= (1−0.3·I/N),  stress += 0.5·CFR',
    insight: 'Oscillation period T ≈ 2π/√(αγ) — deterministic predator-prey cycle',
    ref: 'Lotka 1925, Volterra 1926',
  },
  {
    id: 'evolution',
    label: 'EVOLUTION',
    color: '#ff3d7f',
    subtitle: 'Fisher-Wright Drift',
    stateVec: 'x = [q_A, q_a]ᵀ  (allele freqs)',
    paramVec: 'p = {s, h, Nₑ, μ, q₀}',
    system: [
      { lhs: "q'(t)",   rhs: '= q·[1 + s·q + h·s·(1−q)] / w̄(q)', lc: '#ff3d7f' },
      { lhs: 'w̄(q)',   rhs: '= 1 + 2h·s·q·(1−q) + s·q²',          lc: '#e8e6e3' },
      { lhs: 'σ_drift', rhs: '= √[q(1−q) / (2Nₑ)]  ← stochastic', lc: '#555'    },
    ],
    coupling: 'HOST_CRASH(s) → Nₑ *= (1−s),  μ += 0.002·selection_pressure',
    insight: 'P(fixation | drift) ≈ q₀ — neutral allele fixes with its initial frequency',
    ref: 'Fisher 1930, Wright 1931',
  },
]

const papers = [
  { authors: 'Kermack, W.O. & McKendrick, A.G.', year: '1927', title: 'A Contribution to the Mathematical Theory of Epidemics', journal: 'Proc. R. Soc. Lond. A', color: '#3d7fff', note: 'Original SIR formulation — the foundation of all compartmental epidemic modelling' },
  { authors: 'Volterra, V.', year: '1926', title: 'Fluctuations in the Abundance of a Species Considered Mathematically', journal: 'Nature 118', color: '#00d084', note: 'Lotka-Volterra coupled ODE system — predator-prey oscillation proof' },
  { authors: 'Fisher, R.A.', year: '1930', title: 'The Genetical Theory of Natural Selection', journal: 'Oxford University Press', color: '#ff3d7f', note: 'Fundamental theorem of natural selection — fitness as variance in reproductive rate' },
  { authors: 'Keeling, M.J. & Rohani, P.', year: '2008', title: 'Modeling Infectious Diseases in Humans and Animals', journal: 'Princeton University Press', color: '#3d7fff', note: 'Modern stochastic and deterministic compartmental models — the practitioner reference' },
  { authors: 'Edelstein-Keshet, L.', year: '2005', title: 'Mathematical Models in Biology', journal: 'SIAM Classics', color: '#00d084', note: 'Unified ODE treatment of ecology and epidemiology — direct design inspiration for CosmosLab' },
  { authors: 'Ewens, W.J.', year: '2004', title: 'Mathematical Population Genetics', journal: 'Springer, 2nd ed.', color: '#ff3d7f', note: 'Drift, selection, and mutation — the complete stochastic population genetics framework' },
]

export default function Research() {
  return (
    <section id="wireframes" style={{ position: 'relative', padding: '0', background: '#000' }}>

      {/* Label bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '22px 80px', borderTop: '1px solid #161616', borderBottom: '1px solid #161616' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#555', letterSpacing: '0.25em' }}>06 — Research</span>
        <div style={{ flex: 1, height: '1px', background: '#161616' }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#333', letterSpacing: '0.2em' }}>UNIFIED ODE FOUNDATION · THREE DOMAINS · ONE SOLVER</span>
      </div>

      {/* Thesis — 2-col: heading + proof */}
      <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '460px 1fr', gap: '1px', background: '#161616', marginTop: '1px' }}>
        <div style={{ background: '#020202', padding: '52px 64px 44px' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#c8ff00', letterSpacing: '0.3em', marginBottom: '22px', opacity: 0.6 }}>CORE THESIS</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(2.2rem, 3.2vw, 3.8rem)', lineHeight: 0.92, letterSpacing: '-0.03em', color: '#e8e6e3', margin: '0 0 32px 0' }}>
            ONE<br />EQUATION<br /><span style={{ color: '#c8ff00' }}>THREE<br />DOMAINS</span>
          </h2>
          {/* Generalized ODE — syntax colored */}
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', lineHeight: 2.2, borderLeft: '2px solid #c8ff00', paddingLeft: '20px' }}>
            <span style={{ color: '#c8ff00' }}>d</span><span style={{ color: '#3d7fff' }}>x</span><span style={{ color: '#c8ff00' }}>/dt</span>
            <span style={{ color: '#555' }}> = </span>
            <span style={{ color: '#e8e6e3' }}>f(</span><span style={{ color: '#3d7fff' }}>x</span>
            <span style={{ color: '#555' }}>, </span><span style={{ color: '#00d084' }}>p</span>
            <span style={{ color: '#555' }}>, </span><span style={{ color: '#ff3d7f' }}>t</span>
            <span style={{ color: '#e8e6e3' }}>)</span>
            <span style={{ color: '#444' }}>  +  </span>
            <span style={{ color: '#ff9f3d' }}>C</span>
            <span style={{ color: '#e8e6e3' }}>(</span><span style={{ color: '#ff9f3d' }}>x_other</span><span style={{ color: '#e8e6e3' }}>)</span>
            <div style={{ marginTop: '14px', fontSize: '9px', color: '#2a2a2a', letterSpacing: '0.08em', lineHeight: 1.9 }}>
              <span style={{ color: '#3d7fff' }}>x</span>  — state vector &nbsp;&nbsp; <span style={{ color: '#00d084' }}>p</span>  — param vector<br />
              f  — domain ODE &nbsp;&nbsp; <span style={{ color: '#ff9f3d' }}>C</span>  — coupling term
            </div>
          </div>
        </div>

        <div style={{ background: '#030303', padding: '52px 52px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.85, margin: 0 }}>
              Pandemic spread, predator–prey oscillation, and allele frequency drift are all special cases of the same abstract system: a vector of continuous state variables evolving under coupled nonlinear ODEs with an optional stochastic perturbation term.
            </p>
            <p style={{ fontSize: '13px', color: '#444', lineHeight: 1.8, margin: 0 }}>
              CosmosLab exploits this by building one RK4 integrator loop that takes a domain-specific&nbsp;
              <span style={{ color: '#c8ff00', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>f(x, p, t)</span>
              &nbsp;and an optional cross-domain coupling term&nbsp;
              <span style={{ color: '#ff9f3d', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>C(x_other)</span>.
              &nbsp;Switching domains is a config change — not a code change.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '40px', borderTop: '1px solid #111', paddingTop: '24px' }}>
            {[
              { label: 'Shared integrator', value: 'RK4 dt=0.01' },
              { label: 'Coupling latency',  value: '< 0.5 ms'   },
              { label: 'Tick push rate',    value: '60 fps WS'  },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#c8ff00', marginBottom: '5px' }}>{value}</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#333', letterSpacing: '0.1em' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Three domain equation cards */}
      <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#161616', marginTop: '1px' }}>
        {domains.map(({ id, label, color, subtitle, stateVec, paramVec, system, coupling, insight, ref }) => (
          <div key={id} style={{ background: '#040404', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '26px 30px 18px', borderBottom: `1px solid ${color}1a` }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color, letterSpacing: '0.3em', marginBottom: '6px', opacity: 0.7 }}>{label}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', color: '#e8e6e3', marginBottom: '14px' }}>{subtitle}</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#2a2a2a', lineHeight: 2 }}>
                <div><span style={{ color: '#222' }}>state  </span><span style={{ color: '#444' }}>{stateVec}</span></div>
                <div><span style={{ color: '#222' }}>params </span><span style={{ color: '#444' }}>{paramVec}</span></div>
              </div>
            </div>
            {/* ODE system */}
            <div style={{ padding: '20px 30px', background: '#020202', borderBottom: '1px solid #0d0d0d' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#333', letterSpacing: '0.2em', marginBottom: '12px' }}>ODE SYSTEM</div>
              {system.map(({ lhs, rhs, lc }) => (
                <div key={lhs} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '6px', marginBottom: '7px' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: lc, whiteSpace: 'nowrap' }}>{lhs}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#555', lineHeight: 1.5 }}>{rhs}</span>
                </div>
              ))}
            </div>
            {/* Coupling + insight */}
            <div style={{ padding: '18px 30px 22px' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#333', letterSpacing: '0.2em', marginBottom: '8px' }}>COUPLING RULE</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color, lineHeight: 1.7, marginBottom: '14px', opacity: 0.8 }}>{coupling}</div>
              <div style={{ borderTop: '1px solid #0d0d0d', paddingTop: '12px' }}>
                <div style={{ fontSize: '11px', color: '#444', lineHeight: 1.65, marginBottom: '8px' }}>{insight}</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#2a2a2a' }}>{ref}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Citations */}
      <div className="fade-in" style={{ marginTop: '1px' }}>
        <div style={{ padding: '16px 80px', borderTop: '1px solid #161616', borderBottom: '1px solid #161616' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#444', letterSpacing: '0.3em' }}>FOUNDATIONAL REFERENCES</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#161616' }}>
          {papers.map(({ authors, year, title, journal, color, note }) => (
            <div key={title} style={{ background: '#030303', padding: '22px 26px', borderLeft: `2px solid ${color}18` }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'baseline', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color, fontWeight: 700 }}>{year}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#2a2a2a', letterSpacing: '0.1em' }}>{journal}</span>
              </div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '12px', color: '#e8e6e3', lineHeight: 1.45, marginBottom: '7px' }}>{title}</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#333', marginBottom: '10px' }}>{authors}</div>
              <div style={{ fontSize: '11px', color: '#3a3a3a', lineHeight: 1.65 }}>{note}</div>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}