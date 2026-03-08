import { useRef, useEffect, useState, Fragment } from 'react'

const RINGS = [
  { r: 210, inc: 0.28, color: '#3d7fff', speed: 0.0048, nParticles: 10, label: 'PANDEMIC'  },
  { r: 330, inc: 0.92, color: '#00d084', speed: 0.0032, nParticles: 13, label: 'ECOSYSTEM' },
  { r: 440, inc: 1.55, color: '#ff3d7f', speed: 0.0022, nParticles: 9,  label: 'EVOLUTION' },
]
const FOV = 900
const CONN_THRESHOLD = 130
const GLOBAL_SPEED = 0.0018

const HERO_TEXT     = 'COSMOSLAB'
const SCRAMBLE_CHARS = '!<>-_\/[]{}@#$%^&*XZQJKVW0123456789'
const SUB1 = 'Pandemic. Ecosystem. Evolution.'
const SUB2 = 'One engine. Three simulators. Infinite emergence.'

function ringPoint(r, inc, theta, ry) {
  const px = r * Math.cos(theta)
  const py = -r * Math.sin(theta) * Math.sin(inc)
  const pz = r * Math.sin(theta) * Math.cos(inc)
  return [
    px * Math.cos(ry) + pz * Math.sin(ry),
    py,
    -px * Math.sin(ry) + pz * Math.cos(ry),
  ]
}

function project(xr, yr, zr, cx, cy) {
  const scale = FOV / (FOV + zr + 300)
  return [cx + xr * scale, cy + yr * scale, scale]
}

export default function Hero() {
  const canvasRef  = useRef(null)
  const sectionRef  = useRef(null)
  const [tick, setTick]             = useState(0)
  const [scrambleKey, setScrambleKey] = useState(0)
  const [scrambled,   setScrambled]   = useState(HERO_TEXT)
  const [scrambleDone, setScrambleDone] = useState(false)
  const [subLine1, setSubLine1] = useState('')
  const [subLine2, setSubLine2] = useState('')

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 80)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let ry = 0
    let dpr = window.devicePixelRatio || 1

    const phases = RINGS.map((ring) =>
      Array.from({ length: ring.nParticles }, (_, i) => (i / ring.nParticles) * Math.PI * 2)
    )

    function resize() {
      dpr = window.devicePixelRatio || 1
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    function draw() {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      ctx.clearRect(0, 0, W, H)

      // scanlines
      for (let y = 0; y < H; y += 3) {
        ctx.fillStyle = 'rgba(0,0,0,0.18)'
        ctx.fillRect(0, y, W, 1)
      }

      // subtle dot grid
      ctx.fillStyle = 'rgba(255,255,255,0.025)'
      const gs = 40
      for (let x = 0; x < W; x += gs) {
        for (let y = 0; y < H; y += gs) {
          ctx.fillRect(x, y, 1, 1)
        }
      }

      // radial grid from orbital center
      const cx = W * 0.64
      const cy = H * 0.50
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(cx + Math.cos(angle) * W * 0.6, cy + Math.sin(angle) * H * 0.6)
        ctx.strokeStyle = 'rgba(255,255,255,0.018)'
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
      // radial distance rings
      ;[120, 230, 345, 460].forEach((r) => {
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(255,255,255,0.022)'
        ctx.lineWidth = 0.5
        ctx.stroke()
      })

      // corner viewfinder brackets
      const bSize = 22, bGap = 8
      ;[
        [bGap, bGap],
        [W - bGap - bSize, bGap],
        [bGap, H - bGap - bSize],
        [W - bGap - bSize, H - bGap - bSize],
      ].forEach(([bx, by]) => {
        ctx.strokeStyle = 'rgba(200,255,0,0.3)'
        ctx.lineWidth = 1
        // TL-style bracket rotated per corner
        const isRight = bx > W / 2
        const isBottom = by > H / 2
        ctx.beginPath()
        ctx.moveTo(bx + (isRight ? bSize : 0), by)
        ctx.lineTo(bx + (isRight ? bSize - bSize : 0), by)
        ctx.lineTo(bx + (isRight ? bSize - bSize : 0), by + (isBottom ? bSize : 0))
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(bx + (isRight ? 0 : bSize), by + bSize)
        ctx.lineTo(bx + (isRight ? 0 : bSize), by + (isBottom ? 0 : bSize))
        ctx.lineTo(bx + bSize, by + (isBottom ? 0 : bSize))
        ctx.stroke()
      })

      ry += GLOBAL_SPEED
      phases.forEach((rp, ri) => {
        rp.forEach((_, pi) => { phases[ri][pi] += RINGS[ri].speed })
      })

      // ring ellipses
      RINGS.forEach((ring) => {
        const steps = 180
        ctx.beginPath()
        for (let s = 0; s <= steps; s++) {
          const theta = (s / steps) * Math.PI * 2
          const [xr, yr, zr] = ringPoint(ring.r, ring.inc, theta, ry)
          const [sx, sy] = project(xr, yr, zr, cx, cy)
          s === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy)
        }
        ctx.closePath()
        ctx.strokeStyle = ring.color + '28'
        ctx.lineWidth = 0.6
        ctx.stroke()
      })

      // collect particles
      const all = []
      phases.forEach((rp, ri) => {
        const ring = RINGS[ri]
        rp.forEach((theta) => {
          const [xr, yr, zr] = ringPoint(ring.r, ring.inc, theta, ry)
          const [sx, sy, scale] = project(xr, yr, zr, cx, cy)
          all.push({ sx, sy, scale, color: ring.color, ri })
        })
      })

      // cross-domain lines
      for (let a = 0; a < all.length; a++) {
        for (let b = a + 1; b < all.length; b++) {
          if (all[a].ri === all[b].ri) continue
          const dx = all[a].sx - all[b].sx
          const dy = all[a].sy - all[b].sy
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONN_THRESHOLD) {
            const alpha = (1 - dist / CONN_THRESHOLD) * 0.65
            ctx.beginPath()
            ctx.moveTo(all[a].sx, all[a].sy)
            ctx.lineTo(all[b].sx, all[b].sy)
            ctx.strokeStyle = `rgba(200,255,0,${alpha})`
            ctx.lineWidth = 0.9
            ctx.stroke()
          }
        }
      }

      // particles
      all.forEach(({ sx, sy, scale, color }) => {
        const r = Math.max(1.8, 3.5 * scale)
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 3)
        g.addColorStop(0, color + 'ff')
        g.addColorStop(0.35, color + '88')
        g.addColorStop(1, color + '00')
        ctx.beginPath()
        ctx.arc(sx, sy, r * 3, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
        ctx.beginPath()
        ctx.arc(sx, sy, r, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
      })

      // center crosshair
      ctx.strokeStyle = '#c8ff0040'
      ctx.lineWidth = 0.5
      ctx.beginPath(); ctx.moveTo(cx - 20, cy); ctx.lineTo(cx + 20, cy); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cx, cy - 20); ctx.lineTo(cx, cy + 20); ctx.stroke()
      ctx.beginPath()
      ctx.arc(cx, cy, 5, 0, Math.PI * 2)
      ctx.strokeStyle = '#c8ff0070'
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.fillStyle = '#c8ff00'
      ctx.beginPath()
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2)
      ctx.fill()

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // Re-trigger scramble every time the Hero scrolls into view
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setScrambleDone(false)
          setSubLine1('')
          setSubLine2('')
          setScrambleKey((k) => k + 1)
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(section)
    return () => obs.disconnect()
  }, [])

  // Text-scramble effect
  useEffect(() => {
    if (scrambleKey === 0) return
    let frame = 0
    const id = setInterval(() => {
      const resolvedChars = Math.floor(frame / 1.5)
      setScrambled(
        HERO_TEXT.split('').map((ch, i) =>
          i < resolvedChars
            ? ch
            : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        ).join('')
      )
      frame++
      if (resolvedChars >= HERO_TEXT.length) {
        setScrambled(HERO_TEXT)
        setScrambleDone(true)
        clearInterval(id)
      }
    }, 22)
    return () => clearInterval(id)
  }, [scrambleKey])

  // Sequential typewriter on subtitle after scramble finishes
  useEffect(() => {
    if (!scrambleDone) return
    let alive = true
    let i = 0
    const id1 = setInterval(() => {
      if (!alive) return
      i++
      setSubLine1(SUB1.slice(0, i))
      if (i >= SUB1.length) {
        clearInterval(id1)
        let j = 0
        const id2 = setInterval(() => {
          if (!alive) { clearInterval(id2); return }
          j++
          setSubLine2(SUB2.slice(0, j))
          if (j >= SUB2.length) clearInterval(id2)
        }, 22)
      }
    }, 30)
    return () => { alive = false; clearInterval(id1) }
  }, [scrambleDone])

  const beta = (0.28 + (tick % 7) * 0.003).toFixed(3)
  const nodes = 183 + (tick % 13)
  const conns = 41 + (tick % 5)

  // Count-up for static stats (fires once on mount)
  const [statSims,  setStatSims]  = useState(0)
  const [statAlgos, setStatAlgos] = useState(0)
  useEffect(() => {
    let s = 0, a = 0
    const id = setInterval(() => {
      s = Math.min(s + 1, 3)
      a = Math.min(a + 1, 12)
      setStatSims(s)
      setStatAlgos(a)
      if (s >= 3 && a >= 12) clearInterval(id)
    }, 60)
    return () => clearInterval(id)
  }, [])

  const magMove = (e) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width
    const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height
    el.style.transform = `translate(${dx * 8}px, ${dy * 8}px)`
  }
  const magLeave = (e) => { e.currentTarget.style.transform = '' }

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        paddingTop: '52px',
        background: 'transparent',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Full-bleed canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />

      {/* Left text vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, #000 30%, rgba(0,0,0,0.7) 58%, transparent 80%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      {/* Bottom vignette */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: 'linear-gradient(to top, #000, transparent)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Main text block */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 80px',
          maxWidth: '780px',
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '36px' }}>
          <span style={{ width: '6px', height: '6px', background: '#c8ff00', display: 'inline-block' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#444', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Complex Systems Simulation Platform
          </span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#1c1c1c', letterSpacing: '0.2em' }}>——————</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#c8ff0060', letterSpacing: '0.2em' }}>
            v2.0
          </span>
        </div>

        {/* Headline */}
        <h1
          className={scrambleDone ? 'hero-title-glow' : ''}
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(5.5rem, 14vw, 11rem)',
            lineHeight: 0.86,
            letterSpacing: '-0.03em',
            color: '#e8e6e3',
            margin: '0 0 32px 0',
          }}
        >
          {scrambled.split('').map((ch, i) => (
            <Fragment key={i}>
              {i === 6 && <br />}
              <span style={{
                color: HERO_TEXT[i] === ch
                  ? (i >= 3 && i <= 5 ? '#c8ff00' : '#e8e6e3')
                  : '#c8ff00',
              }}>{ch}</span>
            </Fragment>
          ))}
        </h1>

        {/* Sub */}
        <p
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 300,
            fontSize: '16px',
            color: '#666',
            lineHeight: 1.7,
            maxWidth: '380px',
            marginBottom: '44px',
            minHeight: '3.4em',
          }}
        >
          {subLine1}
          {subLine1.length > 0 && subLine1.length < SUB1.length && (
            <span style={{ color: '#c8ff00', animation: 'blink 0.7s step-end infinite' }}>|</span>
          )}
          {subLine1.length === SUB1.length && <br />}
          {subLine2 && (
            <span style={{ color: '#888' }}>
              {subLine2}
              {subLine2.length < SUB2.length && (
                <span style={{ color: '#c8ff00', animation: 'blink 0.7s step-end infinite' }}>|</span>
              )}
            </span>
          )}
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="#devguide" className="btn-primary" onMouseMove={magMove} onMouseLeave={magLeave}>Get Started</a>
          <a href="#architecture" className="btn-outline" onMouseMove={magMove} onMouseLeave={magLeave}>Architecture</a>
        </div>
      </div>

      {/* Bottom stats bar */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          borderTop: '1px solid #1c1c1c',
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
        }}
      >
        {[
          { label: 'Simulators',        value: statSims || '—',     accent: false },
          { label: 'Shared Algorithms', value: statAlgos ? statAlgos + '+' : '—', accent: false },
          { label: 'β  live',           value: beta,   accent: true  },
          { label: 'Network Nodes',     value: nodes,  accent: false },
          { label: 'Connections',       value: conns,  accent: true  },
          { label: 'Emergence',         value: '∞',    accent: false },
        ].map(({ label, value, accent }, i) => (
          <div
            key={label}
            style={{
              padding: '20px 28px',
              borderRight: i < 5 ? '1px solid #1c1c1c' : 'none',
              background: 'rgba(0,0,0,0.55)',
            }}
          >
            <div
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: '20px',
                color: accent ? '#c8ff00' : '#e8e6e3',
                lineHeight: 1,
                marginBottom: '6px',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {value}
            </div>
            <div className="label-mono">{label}</div>
          </div>
        ))}
      </div>

      {/* HUD — floats in the upper-right open zone, not against the edge */}
      <div
        style={{
          position: 'absolute',
          top: '80px',
          right: '48px',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: '1px',
          width: '200px',
        }}
      >
        {/* Domain legend */}
        <div style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid #1c1c1c', padding: '12px 14px', marginBottom: '8px' }}>
          <div className="label-mono" style={{ marginBottom: '10px', color: '#333' }}>DOMAIN INDEX</div>
          {RINGS.map(({ label, color }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '5px', height: '5px', background: color, display: 'inline-block' }} />
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color, letterSpacing: '0.12em' }}>{label}</span>
              </div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#333' }}>ACTIVE</span>
            </div>
          ))}
        </div>

        {/* Live readouts */}
        {[
          { label: 'FOV', val: `${FOV}px` },
          { label: 'PARTICLES', val: `${RINGS.reduce((s, r) => s + r.nParticles, 0)}` },
          { label: 'CONN / FRAME', val: `${conns}` },
          { label: 'RY RAD', val: (Math.abs(Math.sin(tick * 0.018)) * 6.28).toFixed(3) },
          { label: 'β LIVE', val: beta },
        ].map(({ label, val }) => (
          <div
            key={label}
            style={{
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid #111',
              padding: '7px 12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#333', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{label}</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#c8ff0080', letterSpacing: '0.05em' }}>{val}</span>
          </div>
        ))}

        <div style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid #111', padding: '7px 12px', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '5px', height: '5px', background: '#c8ff00', display: 'inline-block', animation: 'none' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#c8ff0060', letterSpacing: '0.25em', textTransform: 'uppercase' }}>LIVE</span>
        </div>
      </div>

    </section>
  )
}
