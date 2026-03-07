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

  return (
    <section id="problem" style={{ padding: '0', background: '#000', overflow: 'hidden' }}>

      {/* Label bar — matches every other section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '22px 80px', borderTop: '1px solid #161616', borderBottom: '1px solid #161616' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#555', letterSpacing: '0.25em' }}>01 — Problem</span>
        <div style={{ flex: 1, height: '1px', background: '#161616' }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#2a2a2a', letterSpacing: '0.2em' }}>FRAGMENTATION · DOMAIN SILOS · MISSING BRIDGE</span>
      </div>

      {/* Split: giant headline left (unique size) + body text right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#1c1c1c', marginBottom: '1px', marginTop: '1px' }}>
        <div className="fade-in" style={{ background: '#060606', padding: '52px 44px' }}>
          <h2 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 'clamp(3.5rem, 5.5vw, 6.5rem)',
            lineHeight: 0.88, letterSpacing: '-0.035em',
            color: '#e8e6e3', margin: '0 0 36px 0',
          }}>
            THE<br />FRAG<span style={{ color: '#c8ff00' }}>MEN</span><br />TATION
          </h2>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#3a3a3a', lineHeight: 1.8, borderLeft: '2px solid #c8ff00', paddingLeft: '18px', margin: 0 }}>
            Pandemic spread, predator–prey oscillation, and allele fixation are all solutions to the same class of equation: coupled non-linear ODEs. The math is identical. Only the variable names differ.
          </p>
        </div>
        <div className="fade-in" style={{ background: '#040404', padding: '52px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
          <p style={{ color: '#666', lineHeight: 1.9, fontSize: '15px', margin: 0 }}>
            The 2019 COVID-19 outbreak was simultaneously a zoonotic evolutionary event, an ecological transmission cascade, and a network epidemic. Three separate modelling teams built three separate models — none of which could talk to each other.
          </p>
          <p style={{ color: '#444', lineHeight: 1.8, fontSize: '13px', margin: 0 }}>
            This is the norm. Academia funds domain-specific tooling. EPIMODEL, PopDyn, SLiM — excellent within their boundaries, and blind beyond them.
          </p>
        </div>
      </div>

      {/* Stat row — 4 numbers, compact height, no overflow */}
      <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: '#1c1c1c', marginBottom: '60px' }}>
        {stats.map(({ num, label, accent }) => (
          <div key={num} style={{ background: '#030303', padding: '36px 28px 32px' }}>
            <div style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: 'clamp(2.8rem, 4.5vw, 5.5rem)',
              lineHeight: 0.9, letterSpacing: '-0.03em',
              color: accent ? '#c8ff00' : '#181818',
              marginBottom: '16px',
            }}>{num}</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#333', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'pre-line', lineHeight: 1.65 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Gap table */}
      <div className="fade-in" style={{ border: '1px solid #1c1c1c' }}>
        <div style={{ padding: '12px 24px', borderBottom: '1px solid #1c1c1c', display: 'grid', gridTemplateColumns: '120px 1fr 90px', gap: '8px' }}>
          {['Scope', 'Specific Gap', 'Severity'].map(h => (
            <span key={h} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#2a2a2a', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{h}</span>
          ))}
        </div>
        {gaps.map(({ domain, gap, impact, color }) => (
          <div key={gap} style={{ padding: '14px 24px', borderBottom: '1px solid #0c0c0c', display: 'grid', gridTemplateColumns: '120px 1fr 90px', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{domain}</span>
            <span style={{ fontSize: '13px', color: '#777', lineHeight: 1.5 }}>{gap}</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.15em', color: impact === 'CRITICAL' ? '#c8ff00' : impact === 'HIGH' ? '#e8e6e3' : '#555' }}>{impact}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
