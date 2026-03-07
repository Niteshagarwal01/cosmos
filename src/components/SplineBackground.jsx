import { useEffect, useRef } from 'react'

// Atmospheric orbs anchored to DOCUMENT positions — visible on every scroll depth
export default function SplineBackground() {
  const canvasRef = useRef(null)
  const scrollRef = useRef(0)

  useEffect(() => {
    const onScroll = () => { scrollRef.current = window.scrollY }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let dpr = window.devicePixelRatio || 1

    function resize() {
      dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const orbs = [
      { x: 0.72, docFrac: 0.06, r: 360, color: '61,127,255',  speed: 0.00018, phase: 0,   depth: 0.08 },
      { x: 0.15, docFrac: 0.10, r: 300, color: '0,208,132',   speed: 0.00012, phase: 2.1, depth: 0.12 },
      { x: 0.85, docFrac: 0.22, r: 330, color: '255,61,127',  speed: 0.00015, phase: 4.4, depth: 0.10 },
      { x: 0.40, docFrac: 0.30, r: 240, color: '200,255,0',   speed: 0.00009, phase: 1.3, depth: 0.06 },
      { x: 0.08, docFrac: 0.40, r: 280, color: '61,127,255',  speed: 0.00011, phase: 3.7, depth: 0.09 },
      { x: 0.65, docFrac: 0.50, r: 350, color: '0,208,132',   speed: 0.00014, phase: 0.8, depth: 0.11 },
      { x: 0.30, docFrac: 0.60, r: 310, color: '255,61,127',  speed: 0.00017, phase: 5.2, depth: 0.07 },
      { x: 0.80, docFrac: 0.68, r: 260, color: '200,255,0',   speed: 0.00010, phase: 2.9, depth: 0.13 },
      { x: 0.18, docFrac: 0.76, r: 320, color: '61,127,255',  speed: 0.00013, phase: 1.6, depth: 0.08 },
      { x: 0.55, docFrac: 0.84, r: 290, color: '0,208,132',   speed: 0.00016, phase: 3.3, depth: 0.10 },
      { x: 0.75, docFrac: 0.93, r: 340, color: '255,61,127',  speed: 0.00012, phase: 0.4, depth: 0.09 },
      { x: 0.20, docFrac: 0.98, r: 220, color: '200,255,0',   speed: 0.00008, phase: 4.0, depth: 0.06 },
    ]

    let t = 0

    function draw() {
      const W = window.innerWidth
      const H = window.innerHeight
      ctx.clearRect(0, 0, W, H)
      t += 1
      const scroll = scrollRef.current
      const docH = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, H * 8)

      const gridOffsetY = (scroll * 0.12) % 60
      ctx.strokeStyle = 'rgba(255,255,255,0.022)'
      ctx.lineWidth = 0.5
      for (let y = -gridOffsetY; y < H + 60; y += 60) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      }
      for (let x = 0; x < W; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }

      orbs.forEach((orb) => {
        const breathe = Math.sin(t * orb.speed * 1000 + orb.phase) * 0.10
        const r = orb.r * (1 + breathe)
        const docY = orb.docFrac * docH + Math.sin(t * orb.speed * 500 + orb.phase) * 30
        const cy = docY - scroll * (1 - orb.depth)
        const cx = orb.x * W + Math.sin(t * orb.speed * 200 + orb.phase) * 20
        if (cy < -r || cy > H + r) return
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        g.addColorStop(0,   `rgba(${orb.color},0.30)`)
        g.addColorStop(0.4, `rgba(${orb.color},0.15)`)
        g.addColorStop(1,   `rgba(${orb.color},0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.fillStyle = 'rgba(200,255,0,0.05)'
      for (let i = 0; i < 40; i++) {
        const px = ((i * 137.5) % 100) / 100 * W
        const rawY = ((i * 73.1 + t * 0.04) % (H + 40)) - 20
        const py = ((rawY % H) + H) % H
        const dr = 0.8 + (i % 3) * 0.6
        ctx.beginPath(); ctx.arc(px, py, dr, 0, Math.PI * 2); ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 200,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
      }}
    />
  )
}
