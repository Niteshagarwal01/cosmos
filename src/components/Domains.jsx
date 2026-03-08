import { useState } from 'react'

const domains = [
  {
    id: 'pandemic', label: 'PANDEMIC', color: '#3d7fff',
    subtitle: 'Infectious Disease Dynamics',
    models: ['SIR / SEIR / SEIRD', 'Agent-Based Network', 'Spatial Patch Model', 'Stochastic CTMC'],
    params: ['β — transmission rate', 'γ — recovery rate', 'σ — incubation period', 'μ — mortality rate', 'N — population size', 'R₀ — basic reproduction'],
    outputs: ['S/I/R time series', 'Network infection maps', 'Rt real-time estimation', 'Peak timing & magnitude'],
    code: `function sirStep(S, I, R, beta, gamma, N, dt) {
  const newInfected  = beta * S * I / N * dt
  const newRecovered = gamma * I * dt
  return {
    S: S - newInfected,
    I: I + newInfected - newRecovered,
    R: R + newRecovered,
  }
}`,
  },
  {
    id: 'ecosystem', label: 'ECOSYSTEM', color: '#00d084',
    subtitle: 'Ecological Population Dynamics',
    models: ['Lotka-Volterra', 'Competitive Exclusion', 'Food Web Network', 'Climate-Coupled'],
    params: ['α — prey growth rate', 'β — predation rate', 'δ — predator efficiency', 'γ — predator decay', 'K — carrying capacity', 'ε — climate stress'],
    outputs: ['Population oscillations', 'Trophic cascade maps', 'Extinction thresholds', 'Biodiversity index'],
    code: `function lvStep(prey, pred, a, b, d, g, dt) {
  const dPrey = (a * prey - b * prey * pred) * dt
  const dPred = (d * prey * pred - g * pred) * dt
  return {
    prey: prey + dPrey,
    pred: pred + dPred,
  }
}`,
  },
  {
    id: 'evolution', label: 'EVOLUTION', color: '#ff3d7f',
    subtitle: 'Genetic & Adaptive Dynamics',
    models: ['Hardy-Weinberg', 'Fisher-Wright Drift', 'Adaptive Landscape', 'Phylogenetic Simul.'],
    params: ['s — selection coeff.', 'μ — mutation rate', 'N_e — effective pop', 'h — dominance coeff', 'q₀ — initial allele freq', 'g — generations'],
    outputs: ['Allele frequency curves', 'Fixation probabilities', 'Phylogenetic trees', 'Fitness landscape plots'],
    code: `function evolveFreq(q, s, h, Ne, mu) {
  const w  = 1 + 2*h*s*q*(1-q) + s*q*q
  const p1 = q * (1 + s*q + h*s*(1-q)) / w
  const sigma = Math.sqrt(p1*(1-p1)/(2*Ne))
  const drift = sigma * gaussRandom()
  return Math.max(0, Math.min(1, p1 + drift + mu))
}`,
  },
]

export default function Domains() {
  const [active, setActive] = useState('pandemic')
  const d = domains.find((x) => x.id === active)
  const activeIdx = domains.findIndex((x) => x.id === active)

  return (
    <section id="domains" style={{ background: '#000' }}>

      {/* Section label bar */}
      <div className="fade-in" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '22px 80px', borderBottom: '1px solid #161616', borderTop: '1px solid #161616' }}>
        <span className="type-label" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#555', letterSpacing: '0.25em' }}>03 — Domains</span>
        <div style={{ flex: 1, height: '1px', background: '#161616' }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#2a2a2a', letterSpacing: '0.2em' }}>PANDEMIC · ECOSYSTEM · EVOLUTION</span>
      </div>

      {/* Three full-width domain strips — the selector IS the hero */}
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#0d0d0d' }}>
        {domains.map((dm, idx) => (
          <button key={dm.id} onClick={() => setActive(dm.id)} style={{
            all: 'unset', cursor: 'pointer',
            background: active === dm.id ? '#0a0a0a' : '#020202',
            padding: '40px 36px 36px',
            overflow: 'hidden',
            borderBottom: '3px solid transparent',
            display: 'flex', flexDirection: 'column', gap: '16px',
            transition: 'background 0.15s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: active === dm.id ? dm.color : '#1c1c1c', letterSpacing: '0.3em' }}>0{idx + 1}</span>
              <div style={{ flex: 1, height: '1px', background: active === dm.id ? dm.color + '30' : '#111' }} />
            </div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.6rem, 2vw, 2.6rem)', lineHeight: 0.9, letterSpacing: '-0.02em', color: active === dm.id ? '#e8e6e3' : '#1a1a1a', wordBreak: 'break-word' }}>
              {dm.label}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: active === dm.id ? dm.color : '#1e1e1e', letterSpacing: '0.1em', opacity: active === dm.id ? 0.7 : 1 }}>
              {dm.subtitle}
            </div>
            <div style={{ display: 'flex', gap: '20px', marginTop: '4px' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: active === dm.id ? '#333' : '#141414' }}>{dm.models.length} models</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: active === dm.id ? '#333' : '#141414' }}>{dm.params.length} params</span>
            </div>
          </button>
        ))}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, zIndex: 1, pointerEvents: 'none',
          width: '33.333%', height: '3px',
          background: domains[activeIdx].color,
          transform: `translateX(${activeIdx * 100}%)`,
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background 0.35s ease',
          boxShadow: `0 0 10px ${domains[activeIdx].color}55`,
        }} />
      </div>

      {/* Detail — 3-col strip: models | params | outputs */}
      <div key={active} className="tab-panel fade-in stagger-reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#0d0d0d' }}>
        <div style={{ background: '#050505', padding: '36px 40px' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: d.color, letterSpacing: '0.25em', marginBottom: '22px', opacity: 0.5 }}>MODELS</div>
          {d.models.map((m, i) => (
            <div key={m} style={{ padding: '12px 0', borderBottom: '1px solid #0a0a0a', display: 'flex', gap: '14px', alignItems: 'center' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: d.color, opacity: 0.3, flexShrink: 0 }}>{'0' + (i + 1)}</span>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '13px', color: '#c8c6c3' }}>{m}</span>
            </div>
          ))}
        </div>
        <div style={{ background: '#040404', padding: '36px 40px' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: d.color, letterSpacing: '0.25em', marginBottom: '22px', opacity: 0.5 }}>PARAMETERS</div>
          {d.params.map((p) => (
            <div key={p} className="row-item" style={{ padding: '11px 0', borderBottom: '1px solid #0a0a0a' }}>
              <span
                style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#3a3a3a', lineHeight: 1.5, transition: 'color 0.2s, filter 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = d.color; e.currentTarget.style.filter = 'brightness(1.4)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#3a3a3a'; e.currentTarget.style.filter = '' }}
              >{p}</span>
            </div>
          ))}
        </div>
        <div style={{ background: '#050505', padding: '36px 40px' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: d.color, letterSpacing: '0.25em', marginBottom: '22px', opacity: 0.5 }}>OUTPUTS</div>
          {d.outputs.map((o) => (
            <div key={o} className="row-item" style={{ padding: '12px 0', borderBottom: '1px solid #0a0a0a', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '3px', height: '3px', background: '#252525', flexShrink: 0 }} />
              <span className="glow-text" style={{ fontSize: '13px', color: '#555', lineHeight: 1.4 }}>{o}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Code — full width with syntax coloring, padded with the same 80px */}
      <div className="fade-in" style={{ background: '#020202', padding: '36px 80px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: d.color, letterSpacing: '0.25em', opacity: 0.4 }}>CORE STEP FUNCTION</span>
          <div style={{ flex: 1, height: '1px', background: '#0d0d0d' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#1a1a1a' }}>{d.id}_worker.py</span>
        </div>
        <pre style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', lineHeight: 1.9, margin: 0, whiteSpace: 'pre' }}>
          {d.code.split('\n').map((line, i) => {
            const isComment = line.trim().startsWith('//')
            const isKeyword = /\b(function|const|return|let|Math)\b/.test(line)
            return (
              <span key={i} style={{ display: 'block', color: isComment ? '#1e1e1e' : isKeyword ? '#4a4a4a' : i === 0 ? '#777' : '#c8ff00' }}>
                {line}
              </span>
            )
          })}
        </pre>
      </div>
    </section>
  )
}
