import { useEffect, useRef, useState } from 'react'

export default function Splash({ onDone }) {
  const canvasRef  = useRef(null)
  const mouseRef   = useRef({ x: -9999, y: -9999 })
  const progressRef = useRef(0)
  const [progress, setProgress]   = useState(0)
  const [phase,    setPhase]      = useState('in')   // 'in' | 'exit'
  const [dotCount, setDotCount]   = useState(0)

  /* dot animation */
  useEffect(() => {
    const id = setInterval(() => setDotCount(d => (d + 1) % 4), 380)
    return () => clearInterval(id)
  }, [])

  /* progress bar 0→1 over 3.6 s, then fade out */
  useEffect(() => {
    const DURATION = 3600
    let start = null
    const tick = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / DURATION, 1)
      progressRef.current = p
      setProgress(p)
      if (p < 1) requestAnimationFrame(tick)
      else { setPhase('exit'); setTimeout(onDone, 1000) }
    }
    requestAnimationFrame(tick)
  }, [])

  /* Canvas */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let dpr = window.devicePixelRatio || 1

    const resize = () => {
      dpr = window.devicePixelRatio || 1
      canvas.width  = window.innerWidth  * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    /* particles */
    const N = 1400
    const pts = Array.from({ length: N }, () => {
      const x = Math.random() * window.innerWidth
      const y = Math.random() * window.innerHeight
      return { x, y, ox: x, oy: y, vx: 0, vy: 0, sz: Math.random() * 1.1 + 0.3, b: Math.random() * 0.28 + 0.04 }
    })

    /* ripples */
    const ripples = []
    const onMove  = e => { mouseRef.current = { x: e.clientX, y: e.clientY } }
    const onLeave = ()  => { mouseRef.current = { x: -9999, y: -9999 } }
    const onClick  = e => ripples.push({ x: e.clientX, y: e.clientY, r: 0, a: 0.7 })
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('click',     onClick)

    const draw = () => {
      const W = window.innerWidth
      const H = window.innerHeight
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, W, H)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const RR = 160, RF = 4.5, RT = 0.05, FR = 0.68

      /* — particles — */
      for (let i = 0; i < N; i++) {
        const p = pts[i]
        const dx = p.x - mx, dy = p.y - my
        const d  = Math.sqrt(dx*dx + dy*dy) || 1
        if (d < RR) { const f = (1 - d/RR)*RF; p.vx += dx/d*f; p.vy += dy/d*f }
        p.vx += (p.ox - p.x)*RT
        p.vy += (p.oy - p.y)*RT
        p.vx *= FR; p.vy *= FR
        p.x  += p.vx; p.y  += p.vy
        const infl = d < RR ? (1 - d/RR) : 0
        ctx.fillStyle = `rgba(200,255,0,${p.b + infl*0.5})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.sz + infl*1.2, 0, Math.PI*2)
        ctx.fill()
      }

      /* — cursor glow — */
      if (mx > 0 && mx < W) {
        const g = ctx.createRadialGradient(mx, my, 0, mx, my, 180)
        g.addColorStop(0,   'rgba(200,255,0,0.07)')
        g.addColorStop(0.5, 'rgba(200,255,0,0.03)')
        g.addColorStop(1,   'rgba(200,255,0,0)')
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(mx, my, 180, 0, Math.PI*2); ctx.fill()
        ctx.strokeStyle = 'rgba(200,255,0,0.2)'; ctx.lineWidth = 0.5
        ctx.beginPath(); ctx.moveTo(mx-20,my); ctx.lineTo(mx+20,my); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(mx,my-20); ctx.lineTo(mx,my+20); ctx.stroke()
        ctx.strokeStyle = 'rgba(200,255,0,0.4)'; ctx.lineWidth = 0.8
        ctx.beginPath(); ctx.arc(mx, my, 7, 0, Math.PI*2); ctx.stroke()
      }

      /* — ripples — */
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i]
        rp.r += 8; rp.a -= 0.015
        if (rp.a <= 0) { ripples.splice(i,1); continue }
        ctx.strokeStyle = `rgba(200,255,0,${rp.a})`; ctx.lineWidth = 1.2
        ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI*2); ctx.stroke()
      }

      /* — scanlines — */
      for (let y = 0; y < H; y += 4) {
        ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.fillRect(0, y, W, 1)
      }

      /* — corner brackets — */
      const bL = 32
      ;[[0,0,1,1],[W,0,-1,1],[0,H,1,-1],[W,H,-1,-1]].forEach(([bx,by,sx,sy]) => {
        ctx.strokeStyle = 'rgba(200,255,0,0.22)'; ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(bx+sx*bL, by)
        ctx.lineTo(bx, by)
        ctx.lineTo(bx, by+sy*bL)
        ctx.stroke()
      })

      /* — COSMOSLAB title — */
      const cy    = H * 0.44
      const fsize = Math.min(W * 0.12, 120)
      const text  = 'COSMOSLAB'
      // measure actual char widths with a fixed letter spacing approach
      ctx.font = `800 ${fsize}px Syne, sans-serif`
      ctx.textAlign    = 'left'
      ctx.textBaseline = 'middle'
      // build per-char x positions using measureText for accuracy
      const cws   = text.split('').map(c => ctx.measureText(c).width * 1.08)
      const total = cws.reduce((s,w) => s+w, 0)
      let cx0 = W/2 - total/2

      for (let ci = 0; ci < text.length; ci++) {
        const charX  = cx0 + cws[ci]/2
        const cdx    = charX - mx, cdy = cy - my
        const cdist  = Math.sqrt(cdx*cdx + cdy*cdy) || 1
        const maxI   = 260
        const infl   = cdist < maxI ? (1 - cdist/maxI) : 0
        const dispX  = infl * (cdx/cdist) * 40
        const dispY  = infl * (cdy/cdist) * 18

        // base color interpolates to lime on hover
        const r = Math.round(232 - infl*32)
        const g2= Math.round(230 + infl*25)
        const b = Math.round(227 - infl*227)

        ctx.save()
        ctx.translate(charX + dispX, cy + dispY)

        // glow layer behind
        ctx.globalAlpha = 0.15 + infl*0.25
        // @ts-ignore
        ctx.filter = `blur(${8 + infl*14}px)`
        ctx.fillStyle = '#c8ff00'
        ctx.fillText(text[ci], -cws[ci]/2, 0)

        // main crisp text on top
        ctx.filter = 'none'
        ctx.globalAlpha = 0.92 + infl*0.08
        ctx.fillStyle = `rgb(${r},${g2},${b})`
        ctx.fillText(text[ci], -cws[ci]/2, 0)

        ctx.restore()
        cx0 += cws[ci]
      }

      /* — subtitle — */
      ctx.save()
      ctx.font = `400 13px 'Space Grotesk', sans-serif`
      ctx.textAlign    = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle    = 'rgba(200,255,0,0.18)'
      ctx.filter       = 'none'
      ctx.globalAlpha  = 1
      ctx.fillText('COMPLEX SYSTEMS SIMULATION PLATFORM', W/2, cy + fsize*0.62 + 22)
      ctx.restore()

      /* — progress bar — */
      const bW  = Math.min(W * 0.5, 440)
      const bX  = W/2 - bW/2
      const bY  = cy + fsize*0.62 + 52
      const p   = progressRef.current
      // track
      ctx.fillStyle = '#111'; ctx.fillRect(bX, bY, bW, 1)
      // fill
      ctx.fillStyle = '#c8ff00'; ctx.fillRect(bX, bY, p * bW, 1)
      // cursor pip
      ctx.fillRect(bX + p*bW - 1, bY - 3, 2, 7)
      // percentage
      ctx.save()
      ctx.font         = '700 11px Syne, sans-serif'
      ctx.textAlign    = 'right'
      ctx.textBaseline = 'top'
      ctx.fillStyle    = 'rgba(200,255,0,0.35)'
      ctx.fillText(`${Math.round(p*100)}%`, bX + bW, bY + 12)
      ctx.restore()

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize',    resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave',onLeave)
      window.removeEventListener('click',     onClick)
    }
  }, [])

  const modules = ['PANDEMIC', 'ECOSYSTEM', 'EVOLUTION', 'BRIDGE', 'RENDERER']

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#000', cursor: 'none', overflow: 'hidden',
      opacity: phase === 'exit' ? 0 : 1,
      transition: 'opacity 1s cubic-bezier(0.4,0,0.2,1)',
    }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {/* Module status row */}
      <div style={{
        position: 'absolute', bottom: '56px', left: 0, right: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
        zIndex: 2, pointerEvents: 'none',
      }}>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {modules.map((label, i) => {
            const lit = progress >= (i + 0.8) / modules.length
            return (
              <span key={label} style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '9px',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: lit ? 'rgba(200,255,0,0.55)' : '#1e1e1e',
                transition: 'color 0.5s ease',
              }}>
                {lit ? '▶' : '○'} {label}
              </span>
            )
          })}
        </div>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
          letterSpacing: '0.25em', color: '#252525', textTransform: 'uppercase',
        }}>
          INITIALIZING{'.'.repeat(dotCount)}
        </div>
      </div>

      {/* Bottom corners */}
      <div style={{ position: 'absolute', bottom: '20px', left: '32px', fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#1a1a1a', letterSpacing: '0.15em', pointerEvents: 'none' }}>
        COSMOSLAB — v2.0
      </div>
      <div style={{ position: 'absolute', bottom: '20px', right: '32px', fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#1a1a1a', letterSpacing: '0.15em', pointerEvents: 'none' }}>
        HOVER · CLICK
      </div>
    </div>
  )
}
