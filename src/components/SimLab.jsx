import { useState, useCallback, useMemo } from 'react'
import SimChart from './SimChart'
import { runPandemic, runEcosystem, runEvolution } from '../modules/SimEngine'

// ── colour map ──────────────────────────────────────────────
const DOMAIN_META = {
  pandemic:  { color: '#3d7fff', label: 'PANDEMIC',  short: 'SIR/SEIR Epidemic' },
  ecosystem: { color: '#00d084', label: 'ECOSYSTEM', short: 'Lotka-Volterra ODE' },
  evolution: { color: '#ff3d7f', label: 'EVOLUTION', short: 'Fisher-Wright Drift' },
}

// ── default params per domain ───────────────────────────────
const DEFAULTS = {
  pandemic:  { beta: 0.35, gamma: 0.10, sigma: 0.20, N: 1000, I0: 5   },
  ecosystem: { alpha: 0.8, beta: 0.02,  delta: 0.01, gamma: 0.4, K: 500 },
  evolution: { s: 0.05, h: 0.5, Ne: 200, mu: 0.001, q0: 0.3 },
}

// ── param definitions ───────────────────────────────────────
const PARAM_DEFS = {
  pandemic: [
    { key: 'beta',  label: 'β — Transmission rate', min: 0.01, max: 1,    step: 0.01, fmt: v => v.toFixed(2) },
    { key: 'gamma', label: 'γ — Recovery rate',      min: 0.01, max: 0.5,  step: 0.01, fmt: v => v.toFixed(2) },
    { key: 'sigma', label: 'σ — Incubation rate',    min: 0.01, max: 0.5,  step: 0.01, fmt: v => v.toFixed(2) },
    { key: 'N',     label: 'N — Population',         min: 100,  max: 5000, step: 100,  fmt: v => v.toFixed(0) },
    { key: 'I0',    label: 'I₀ — Initial infected',  min: 1,    max: 100,  step: 1,    fmt: v => v.toFixed(0) },
  ],
  ecosystem: [
    { key: 'alpha', label: 'α — Prey growth',        min: 0.1, max: 2,   step: 0.05, fmt: v => v.toFixed(2) },
    { key: 'beta',  label: 'β — Predation rate',     min: 0.005, max: 0.1, step: 0.005, fmt: v => v.toFixed(3) },
    { key: 'delta', label: 'δ — Predator efficiency',min: 0.002, max: 0.05, step: 0.002, fmt: v => v.toFixed(3) },
    { key: 'gamma', label: 'γ — Predator decay',     min: 0.1, max: 1,   step: 0.05, fmt: v => v.toFixed(2) },
    { key: 'K',     label: 'K — Carrying capacity',  min: 100, max: 2000, step: 50,  fmt: v => v.toFixed(0) },
  ],
  evolution: [
    { key: 's',  label: 's — Selection coeff.',   min: -0.2, max: 0.3,  step: 0.005, fmt: v => v.toFixed(3) },
    { key: 'h',  label: 'h — Dominance coeff.',   min: 0,    max: 1,    step: 0.05,  fmt: v => v.toFixed(2) },
    { key: 'Ne', label: 'Nₑ — Effective pop.',    min: 20,   max: 1000, step: 10,    fmt: v => v.toFixed(0) },
    { key: 'mu', label: 'μ — Mutation rate',      min: 0,    max: 0.01, step: 0.0005,fmt: v => v.toFixed(4) },
    { key: 'q0', label: 'q₀ — Initial freq.',     min: 0.01, max: 0.99, step: 0.01, fmt: v => v.toFixed(2) },
  ],
}

// ── param slider ────────────────────────────────────────────
function ParamSlider({ def, value, onChange, color }) {
  const pct = ((value - def.min) / (def.max - def.min)) * 100
  return (
    <div style={{ marginBottom: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '7px' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#555', letterSpacing: '0.06em' }}>
          {def.label}
        </span>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '12px',
          color, fontWeight: 700, minWidth: '52px', textAlign: 'right',
          textShadow: `0 0 8px ${color}66`,
        }}>
          {def.fmt(value)}
        </span>
      </div>
      {/* track */}
      <div style={{ position: 'relative', height: '3px', background: '#111', cursor: 'pointer' }}
        onClick={e => {
          const rect = e.currentTarget.getBoundingClientRect()
          const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
          onChange(def.min + pct * (def.max - def.min))
        }}
      >
        <div style={{ position: 'absolute', left: 0, top: 0, height: '3px', width: pct + '%', background: color, boxShadow: `0 0 6px ${color}88`, transition: 'width 0.08s' }} />
        <input
          type="range" min={def.min} max={def.max} step={def.step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            position: 'absolute', inset: '-6px 0', width: '100%', opacity: 0, cursor: 'pointer', margin: 0,
          }}
        />
        {/* thumb */}
        <div style={{
          position: 'absolute', top: '50%', left: pct + '%',
          width: '10px', height: '10px', background: color,
          transform: 'translate(-50%, -50%)',
          boxShadow: `0 0 8px ${color}`,
          pointerEvents: 'none',
          transition: 'left 0.08s',
        }} />
      </div>
    </div>
  )
}

// ── domain selector tab ─────────────────────────────────────
function DomainTab({ id, meta, isActive, onClick }) {
  return (
    <button onClick={onClick} style={{
      all: 'unset', cursor: 'pointer',
      padding: '14px 20px',
      background: isActive ? '#0a0a0a' : 'transparent',
      borderBottom: isActive ? `2px solid ${meta.color}` : '2px solid transparent',
      display: 'flex', flexDirection: 'column', gap: '4px',
      transition: 'background 0.15s',
      flex: 1, minWidth: 0, overflow: 'hidden',
    }}>
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: isActive ? meta.color : '#2a2a2a', letterSpacing: '0.2em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {meta.label}
      </span>
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: isActive ? '#555' : '#1e1e1e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {meta.short}
      </span>
    </button>
  )
}

// ── main export (shell + left param panel only) ─────────────
export default function SimLab() {
  const [domain, setDomain] = useState('pandemic')
  const [params, setParams] = useState({ ...DEFAULTS })
  const [running, setRunning] = useState(false)

  const meta   = DOMAIN_META[domain]
  const defs   = PARAM_DEFS[domain]
  const curP   = params[domain]

  const setParam = useCallback((key, val) => {
    setParams(prev => ({ ...prev, [domain]: { ...prev[domain], [key]: val } }))
  }, [domain])

  const resetParams = () => setParams(prev => ({ ...prev, [domain]: { ...DEFAULTS[domain] } }))

  return (
    <section id="simlab" style={{ padding: '0', background: '#000', overflow: 'hidden' }}>

      {/* ── section label bar ── */}
      <div className="fade-in" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '20px', padding: '22px 80px', borderTop: '1px solid #161616', borderBottom: '1px solid #161616', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, height: '2px', width: '100%', background: 'linear-gradient(90deg, transparent 0%, #c8ff00 50%, transparent 100%)', animation: 'scanBar 3s ease-in-out infinite' }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#c8ff0088', letterSpacing: '0.25em', textTransform: 'uppercase', textShadow: '0 0 12px #c8ff0055' }}>07 — Simulation Lab</span>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #c8ff0022, transparent)' }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#333', letterSpacing: '0.2em' }}>LIVE PARAMETER CONTROL · REAL-TIME ODE · THREE DOMAINS</span>
      </div>

      {/* ── domain tabs ── */}
      <div style={{ display: 'flex', gap: '1px', background: '#111', borderBottom: '1px solid #111' }}>
        {Object.entries(DOMAIN_META).map(([id, meta]) => (
          <DomainTab key={id} id={id} meta={meta} isActive={domain === id} onClick={() => { setDomain(id); setRunning(false) }} />
        ))}
        {/* run/stop button */}
        <button
          onClick={() => setRunning(r => !r)}
          className={running ? 'btn-outline' : 'btn-primary'}
          style={{ alignSelf: 'stretch', padding: '0 28px', borderRadius: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', letterSpacing: '0.2em', flexShrink: 0 }}
        >
          <span style={{ width: '5px', height: '5px', background: running ? '#c8ff00' : '#000', display: 'inline-block', animation: running ? 'breathePulse 1s ease-in-out infinite' : 'none' }} />
          {running ? 'RUNNING' : 'RUN SIM'}
        </button>
      </div>

      {/* ── 3-column body ── */}
      <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '300px 1fr 240px', gap: '1px', background: '#111', minHeight: '520px' }}>

        {/* LEFT — param sliders */}
        <div style={{ background: '#030303', padding: '32px 28px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#c8ff00', letterSpacing: '0.3em', opacity: 0.7 }}>PARAMETERS</span>
            <button onClick={resetParams} style={{
              all: 'unset', cursor: 'pointer',
              fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#333',
              letterSpacing: '0.15em', border: '1px solid #1c1c1c', padding: '3px 8px',
              transition: 'color 0.15s, border-color 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#c8ff00'; e.currentTarget.style.borderColor = '#c8ff0044' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#333'; e.currentTarget.style.borderColor = '#1c1c1c' }}
            >RESET</button>
          </div>
          {defs.map(def => (
            <ParamSlider key={def.key} def={def} value={curP[def.key]} onChange={val => setParam(def.key, val)} color={meta.color} />
          ))}
        </div>

        {/* CENTRE — chart */}
        <SimChart domain={domain} params={curP} meta={meta} running={running} />

        {/* RIGHT — live readouts */}
        <SimStatsPanel domain={domain} params={curP} meta={meta} />
      </div>
    </section>
  )
}

// ── short number formatter — prevents overflow ───────────────
function fmt(v, decimals = 2) {
  const n = Number(v)
  if (isNaN(n)) return '—'
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (Math.abs(n) >= 1e4) return (n / 1e3).toFixed(1) + 'k'
  if (Math.abs(n) >= 1000) return Math.round(n).toString()
  return n.toFixed(decimals)
}

// ── right-side live stats panel ─────────────────────────────
function SimStatsPanel({ domain, params, meta }) {
  const stats = useMemo(() => {
    if (domain === 'pandemic') {
      const R0     = params.beta / params.gamma
      const pd     = runPandemic(params)
      const peakI  = Math.max(...pd.I)
      const peakIdx = pd.I.indexOf(peakI)
      const peakT  = pd.t[peakIdx]
      const herd   = Math.max(0, (1 - 1 / R0) * 100)
      return [
        { label: 'R₀',            value: fmt(R0, 2),     note: 'basic reproduction no.' },
        { label: 'Peak infected', value: fmt(peakI, 0),  note: 'max simultaneous cases'  },
        { label: 'Peak day',      value: fmt(peakT, 1),  note: 'time to epidemic peak'  },
        { label: 'Herd immunity', value: fmt(herd, 1)+'%', note: '1 − 1/R₀'             },
      ]
    }
    if (domain === 'ecosystem') {
      const T      = (2 * Math.PI) / Math.sqrt(params.alpha * params.gamma)
      const eqPrey = params.gamma / params.delta
      const rawPred = params.alpha / params.beta * (1 - eqPrey / params.K)
      return [
        { label: 'Cycle period T', value: fmt(T, 1),           note: '2π / √(αγ)'        },
        { label: 'Prey equil.',    value: fmt(eqPrey, 0),      note: 'γ/δ equilibrium'    },
        { label: 'Pred equil.',    value: fmt(rawPred, 0),     note: 'α·δ/βγ equilibrium' },
        { label: 'Carry. cap. K', value: fmt(params.K, 0),    note: 'logistic ceiling'    },
      ]
    }
    // evolution
    const t50  = Math.log(0.5) / Math.log(1 - 1 / (2 * params.Ne))
    const sEff = params.s * (params.h + (1 - params.h) * params.q0)
    return [
      { label: 'P(fixation)',   value: fmt(params.q0, 3),  note: '≈ q₀ neutral drift'  },
      { label: 'Half-life',     value: fmt(t50, 0) + 'g',  note: 'drift half-time (gen)' },
      { label: 'Eff. sel.',     value: fmt(sEff, 4),       note: 's·(h+(1−h)q₀)'       },
      { label: 'Nₑ pop.',      value: fmt(params.Ne, 0),  note: 'effective population'  },
    ]
  }, [domain, params])

  return (
    <div style={{ background: '#030303', padding: '28px 22px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#c8ff00', letterSpacing: '0.3em', opacity: 0.6, marginBottom: '20px', display: 'block' }}>LIVE METRICS</span>

      {stats.map(({ label, value, note }) => (
        <div key={label} className="card-lift" style={{
          padding: '14px 16px', marginBottom: '1px',
          background: '#020202', border: '1px solid #111',
          borderLeft: `2px solid ${meta.color}22`,
        }}>
          <div className="sim-stat-value" style={{ color: meta.color, textShadow: `0 0 10px ${meta.color}44` }}>
            {value}
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#666', letterSpacing: '0.08em', marginBottom: '4px' }}>{label}</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#2a2a2a', letterSpacing: '0.05em', lineHeight: 1.5 }}>{note}</div>
        </div>
      ))}

      {/* domain badge */}
      <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #111' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#1e1e1e', letterSpacing: '0.2em', marginBottom: '8px' }}>MODEL TYPE</div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: meta.color, opacity: 0.5, letterSpacing: '0.12em' }}>
          {domain === 'pandemic' ? 'SEIR ODE · RK4' : domain === 'ecosystem' ? 'LV ODE · RK4' : 'FISHER-WRIGHT · STOCHASTIC'}
        </div>
      </div>
    </div>
  )
}

