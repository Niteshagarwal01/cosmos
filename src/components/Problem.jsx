import { useEffect, useRef, useState, useCallback } from 'react'

function useInViewRetrigger(threshold = 0.25) {
  const ref = useRef(null)
  const [key, setKey] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setKey(k => k + 1) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, key]
}

function useMagnetic() {
  const ref = useRef(null)
  const onMouseMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / rect.width
    const dy = (e.clientY - cy) / rect.height
    el.style.transform = `translate(${dx * 10}px, ${dy * 10}px) scale(1.06)`
    el.style.textShadow = '0 0 24px rgba(200,255,0,0.45), 0 0 48px rgba(200,255,0,0.15)'
    el.style.filter = 'brightness(2.2)'
  }, [])
  const onMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = ''
    el.style.textShadow = ''
    el.style.filter = ''
  }, [])
  return { ref, onMouseMove, onMouseLeave }
}

function StatCard({ num, label, accent, animKey }) {
  const [display, setDisplay] = useState('—')
  const mag = useMagnetic()

  useEffect(() => {
    if (animKey === 0) return
    // parse type
    if (num === '0') {
      // flash then lock
      const seq = [9, 7, 4, 2, 1, 0]
      let i = 0
      const id = setInterval(() => {
        setDisplay(String(seq[i]))
        i++
        if (i >= seq.length) clearInterval(id)
      }, 80)
      return () => clearInterval(id)
    }
    if (num === '95%') {
      let v = 0
      const id = setInterval(() => {
        v = Math.min(v + 3, 95)
        setDisplay(v + '%')
        if (v >= 95) clearInterval(id)
      }, 28)
      return () => clearInterval(id)
    }
    if (num === '3–4×') {
      const frames = ['0×','1×','2×','3×','3–4×']
      let i = 0
      const id = setInterval(() => {
        setDisplay(frames[i])
        i++
        if (i >= frames.length) clearInterval(id)
      }, 100)
      return () => clearInterval(id)
    }
    if (num === '2019') {
      let v = 2010
      const id = setInterval(() => {
        v = Math.min(v + 1, 2019)
        setDisplay(String(v))
        if (v >= 2019) clearInterval(id)
      }, 80)
      return () => clearInterval(id)
    }
  }, [animKey, num])

  return (
    <div style={{ background: '#030303', padding: '36px 28px 32px', overflow: 'hidden', position: 'relative' }}>
      <div
        ref={mag.ref}
        onMouseMove={mag.onMouseMove}
        onMouseLeave={mag.onMouseLeave}
        style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800,
          fontSize: 'clamp(2.8rem, 4.5vw, 5.5rem)',
          lineHeight: 0.9, letterSpacing: '-0.03em',
          color: accent ? '#c8ff00' : '#e8e6e3',
          marginBottom: '16px',
          display: 'inline-block',
          transition: 'transform 0.18s ease, filter 0.18s ease, text-shadow 0.18s ease',
          cursor: 'default',
        }}
      >
        {display}
      </div>
      <div className="glow-text" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#333', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'pre-line', lineHeight: 1.65 }}>{label}</div>
    </div>
  )
}

function GlitchHeadline({ animKey }) {
  const [lines, setLines] = useState(['THE', 'FRAGMENTATION'])

  useEffect(() => {
    if (animKey === 0) return
    let frame = 0
    const total = 18
    const id = setInterval(() => {
      frame++
      if (frame > total) {
        setLines(['THE', 'FRAGMENTATION'])
        clearInterval(id)
        return
      }
      const progress = frame / total
      setLines(HEADLINE.map(word =>
        word.split('').map((ch, i) =>
          Math.random() > progress
            ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
            : ch
        ).join('')
      ))
    }, 40)
    return () => clearInterval(id)
  }, [animKey])

  return (
    <h2 style={{
      fontFamily: 'Syne, sans-serif', fontWeight: 800,
      fontSize: 'clamp(3.5rem, 5.5vw, 6.5rem)',
      lineHeight: 0.88, letterSpacing: '-0.035em',
      color: '#e8e6e3', margin: '0 0 36px 0',
    }}>
      {lines[0]}<br />
      {lines[1].slice(0, 4)}
      <span style={{ color: '#c8ff00' }}>{lines[1].slice(4, 7)}</span>
      {lines[1].slice(7)}
    </h2>
  )
}

function GapRow({ domain, gap, impact, color, index }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="row-item"
      style={{
        padding: '14px 24px', borderBottom: '1px solid #0c0c0c',
        display: 'grid', gridTemplateColumns: '120px 1fr 90px',
        alignItems: 'center', gap: '8px',
        opacity: visible ? 1 : 0.15,
        transition: `opacity 0.5s ease ${index * 0.07}s`,
      }}
    >
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{domain}</span>
      <span className="glow-text" style={{ fontSize: '13px', color: '#777', lineHeight: 1.5 }}>{gap}</span>
      <span style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.15em',
        color: impact === 'CRITICAL' ? '#c8ff00' : impact === 'HIGH' ? '#e8e6e3' : '#555',
        textShadow: impact === 'CRITICAL' ? '0 0 12px rgba(200,255,0,0.5)' : 'none',
      }}>{impact}</span>
    </div>
  )
}

export default function Problem() {
  const gaps = [
    { domain: 'Pandemic',  gap: 'SIR variants cannot accept ecological carrying-capacity data as input', impact: 'HIGH',     color: '#3d7fff' },
    { domain: 'Ecosystem', gap: 'Lotka-Volterra models have no mechanism for pathogen-driven extinction', impact: 'HIGH',     color: '#00d084' },
    { domain: 'Evolution', gap: 'Fisher-Wright drift ignores host-population crashes during selection',   impact: 'HIGH',     color: '#ff3d7f' },
    { domain: 'All',       gap: 'No shared event schema — domain thresholds cannot trigger each other',   impact: 'CRITICAL', color: '#c8ff00' },
    { domain: 'All',       gap: 'Simulation state is opaque — no standardised mid-run inspection API',    impact: 'HIGH',     color: '#c8ff00' },
    { domain: 'All',       gap: 'Reproducibility gap — no portable scenario format across tools',         impact: 'MED',      color: '#c8ff00' },
  ]

  const stats = [
    { num: '95%',  label: 'of published simulations\nstay within one domain',   accent: false },
    { num: '0',    label: 'open platforms bridge\nall 3 domains today',          accent: true  },
    { num: '3–4×', label: 'faster insight when\nmodels are coupled',            accent: false },
    { num: '2019', label: 'last major unified sim\nplatform released',            accent: false },
  ]

  const [headlineRef] = useInViewRetrigger(0.4)
  const [statsRef, statsKey] = useInViewRetrigger(0.3)

  return (
    <section id="problem" style={{ padding: '0', background: '#000', overflow: 'hidden' }}>

      {/* Label bar */}
      <div className="fade-in" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '20px', padding: '22px 80px', borderTop: '1px solid #161616', borderBottom: '1px solid #161616', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, height: '2px', width: '100%', background: 'linear-gradient(90deg, transparent 0%, #c8ff00 50%, transparent 100%)', animation: 'scanBar 3s ease-in-out infinite' }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#c8ff0088', letterSpacing: '0.25em', textTransform: 'uppercase', textShadow: '0 0 12px #c8ff0055' }}>01 — Problem</span>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #c8ff0022, transparent)' }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#333', letterSpacing: '0.2em' }}>FRAGMENTATION · DOMAIN SILOS · MISSING BRIDGE</span>
      </div>

      {/* Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#1c1c1c', marginBottom: '1px', marginTop: '1px' }}>
        <div ref={headlineRef} className="fade-in" style={{ background: '#060606', padding: '52px 44px' }}>
          <h2 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 'clamp(3.5rem, 5.5vw, 6.5rem)',
            lineHeight: 0.88, letterSpacing: '-0.035em',
            color: '#e8e6e3', margin: '0 0 36px 0',
          }}>
            THE<br />FRAG<span style={{ color: '#c8ff00' }}>MEN</span><br />TATION
          </h2>
          <p className="glow-text" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#3a3a3a', lineHeight: 1.8, borderLeft: '2px solid #c8ff00', paddingLeft: '18px', margin: 0 }}>
            Pandemic spread, predator–prey oscillation, and allele fixation are all solutions to the same class of equation: coupled non-linear ODEs. The math is identical. Only the variable names differ.
          </p>
        </div>
        <div className="fade-in" style={{ background: '#040404', padding: '52px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
          <p className="glow-text" style={{ color: '#666', lineHeight: 1.9, fontSize: '15px', margin: 0 }}>
            The 2019 COVID-19 outbreak was simultaneously a zoonotic evolutionary event, an ecological transmission cascade, and a network epidemic. Three separate modelling teams built three separate models — none of which could talk to each other.
          </p>
          <p className="glow-text" style={{ color: '#444', lineHeight: 1.8, fontSize: '13px', margin: 0 }}>
            This is the norm. Academia funds domain-specific tooling. EPIMODEL, PopDyn, SLiM — excellent within their boundaries, and blind beyond them.
          </p>
        </div>
      </div>

      {/* Stat row */}
      <div ref={statsRef} className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: '#1c1c1c', marginBottom: '60px' }}>
        {stats.map(({ num, label, accent }) => (
          <StatCard key={num} num={num} label={label} accent={accent} animKey={statsKey} />
        ))}
      </div>

      {/* Gap table */}
      <div className="fade-in" style={{ border: '1px solid #1c1c1c' }}>
        <div style={{ padding: '12px 24px', borderBottom: '1px solid #1c1c1c', display: 'grid', gridTemplateColumns: '120px 1fr 90px', gap: '8px' }}>
          {['Scope', 'Specific Gap', 'Severity'].map(h => (
            <span key={h} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#2a2a2a', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{h}</span>
          ))}
        </div>
        {gaps.map(({ domain, gap, impact, color }, i) => (
          <GapRow key={gap} domain={domain} gap={gap} impact={impact} color={color} index={i} />
        ))}
      </div>
    </section>
  )
}

