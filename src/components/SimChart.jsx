import { useEffect, useRef, useMemo } from 'react'
import { runPandemic, runEcosystem, runEvolution } from '../modules/SimEngine'

// ── shared canvas draw helpers ───────────────────────────────
function drawGrid(ctx, W, H, pad) {
  ctx.strokeStyle = 'rgba(255,255,255,0.03)'
  ctx.lineWidth = 0.5
  const cols = 8, rows = 5
  for (let c = 0; c <= cols; c++) {
    const x = pad.l + (c / cols) * (W - pad.l - pad.r)
    ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, H - pad.b); ctx.stroke()
  }
  for (let r = 0; r <= rows; r++) {
    const y = pad.t + (r / rows) * (H - pad.t - pad.b)
    ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke()
  }
}

function drawLine(ctx, xs, ys, color, W, H, pad, maxY, alpha = 1) {
  if (!xs.length) return
  ctx.beginPath()
  ctx.strokeStyle = color + Math.round(alpha * 255).toString(16).padStart(2, '0')
  ctx.lineWidth = 1.5
  ctx.lineJoin = 'round'
  const sx = i => pad.l + (xs[i] / xs[xs.length - 1]) * (W - pad.l - pad.r)
  const sy = v  => H - pad.b - (v / maxY) * (H - pad.t - pad.b)
  ctx.moveTo(sx(0), sy(ys[0]))
  for (let i = 1; i < xs.length; i++) ctx.lineTo(sx(i), sy(ys[i]))
  ctx.stroke()
}

function drawAxisLabels(ctx, W, H, pad, maxY, tMax, color) {
  ctx.fillStyle = color + '55'
  ctx.font = '9px JetBrains Mono, monospace'
  ctx.textAlign = 'right'
  for (let r = 0; r <= 5; r++) {
    const v = (maxY * (5 - r) / 5)
    const y = pad.t + (r / 5) * (H - pad.t - pad.b)
    const label = v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v.toFixed(v < 1 ? 2 : 0)
    ctx.fillText(label, pad.l - 5, y + 3)
  }
  ctx.textAlign = 'center'
  for (let c = 0; c <= 4; c++) {
    const t = (tMax * c / 4).toFixed(0)
    const x = pad.l + (c / 4) * (W - pad.l - pad.r)
    ctx.fillText(t, x, H - 4)
  }
}

// ── PANDEMIC chart ───────────────────────────────────────────
function drawPandemic(ctx, W, H, data, meta) {
  const pad = { l: 46, r: 16, t: 16, b: 20 }
  drawGrid(ctx, W, H, pad)
  const maxY = data.N || Math.max(...data.S, ...data.I, ...data.R)
  const tArr = data.t
  drawLine(ctx, tArr, data.S, '#e8e6e3', W, H, pad, maxY, 0.7)
  drawLine(ctx, tArr, data.E, '#ff9f3d', W, H, pad, maxY, 0.85)
  drawLine(ctx, tArr, data.I, meta.color, W, H, pad, maxY, 1)
  drawLine(ctx, tArr, data.R, '#c8ff00', W, H, pad, maxY, 0.75)
  drawAxisLabels(ctx, W, H, pad, maxY, tArr[tArr.length-1], '#555')
  // legend
  const leg = [['S', '#e8e6e3'], ['E', '#ff9f3d'], ['I', meta.color], ['R', '#c8ff00']]
  leg.forEach(([l, c], i) => {
    ctx.fillStyle = c; ctx.fillRect(W - 52, 20 + i * 16, 8, 2)
    ctx.fillStyle = c + '99'; ctx.font = '9px JetBrains Mono, monospace'
    ctx.textAlign = 'left'; ctx.fillText(l, W - 40, 23 + i * 16)
  })
}

// ── ECOSYSTEM chart ──────────────────────────────────────────
function drawEcosystem(ctx, W, H, data, meta) {
  const pad = { l: 46, r: 16, t: 16, b: 20 }
  drawGrid(ctx, W, H, pad)
  const maxY = Math.max(...data.prey, ...data.pred)
  const tArr = data.t
  drawLine(ctx, tArr, data.prey, '#00d084', W, H, pad, maxY, 1)
  drawLine(ctx, tArr, data.pred, '#ff3d7f', W, H, pad, maxY, 0.85)
  drawAxisLabels(ctx, W, H, pad, maxY, tArr[tArr.length-1], '#555')
  const leg = [['PREY', '#00d084'], ['PRED', '#ff3d7f']]
  leg.forEach(([l, c], i) => {
    ctx.fillStyle = c; ctx.fillRect(W - 72, 20 + i * 16, 8, 2)
    ctx.fillStyle = c + '99'; ctx.font = '9px JetBrains Mono, monospace'
    ctx.textAlign = 'left'; ctx.fillText(l, W - 60, 23 + i * 16)
  })
}

// ── EVOLUTION chart ──────────────────────────────────────────
function drawEvolution(ctx, W, H, data, meta) {
  const pad = { l: 38, r: 16, t: 16, b: 20 }
  drawGrid(ctx, W, H, pad)
  const maxY = 1.0
  const tArr = data.t
  // fixation threshold line
  const sy = v => H - pad.b - (v / maxY) * (H - pad.t - pad.b)
  ctx.setLineDash([4, 4]); ctx.strokeStyle = '#c8ff0022'; ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(pad.l, sy(1)); ctx.lineTo(W - pad.r, sy(1)); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(pad.l, sy(0)); ctx.lineTo(W - pad.r, sy(0)); ctx.stroke()
  ctx.setLineDash([])
  drawLine(ctx, tArr, data.qDet, meta.color + '55', W, H, pad, maxY, 0.5)
  drawLine(ctx, tArr, data.q,    meta.color, W, H, pad, maxY, 1)
  drawAxisLabels(ctx, W, H, pad, maxY, tArr[tArr.length-1], '#555')
  const leg = [['q (stochastic)', meta.color], ['q (deterministic)', meta.color + '55']]
  leg.forEach(([l, c], i) => {
    ctx.fillStyle = c; ctx.fillRect(W - 130, 20 + i * 16, 8, 2)
    ctx.fillStyle = c + '99'; ctx.font = '9px JetBrains Mono, monospace'
    ctx.textAlign = 'left'; ctx.fillText(l, W - 118, 23 + i * 16)
  })
}

// ── main chart component ─────────────────────────────────────
export default function SimChart({ domain, params, meta, running }) {
  const canvasRef = useRef(null)
  const dataRef   = useRef(null)
  const frameRef  = useRef(null)
  const stepRef   = useRef(0)

  // compute full dataset on param change
  const fullData = useMemo(() => {
    if (domain === 'pandemic')  return runPandemic(params)
    if (domain === 'ecosystem') return runEcosystem(params)
    return runEvolution(params)
  }, [domain, params])

  // draw function
  const draw = (progress) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)

    if (!fullData) return
    const steps = Math.round(progress * (fullData.t.length - 1))
    const slice = key => fullData[key]?.slice(0, steps + 1) ?? []

    let sliced
    if (domain === 'pandemic')
      sliced = { S: slice('S'), E: slice('E'), I: slice('I'), R: slice('R'), t: slice('t'), N: params.N }
    else if (domain === 'ecosystem')
      sliced = { prey: slice('prey'), pred: slice('pred'), t: slice('t') }
    else
      sliced = { q: slice('q'), qDet: slice('qDet'), t: slice('t') }

    if (domain === 'pandemic')  drawPandemic(ctx, W, H, sliced, meta)
    if (domain === 'ecosystem') drawEcosystem(ctx, W, H, sliced, meta)
    if (domain === 'evolution') drawEvolution(ctx, W, H, sliced, meta)
  }

  // animate when running
  useEffect(() => {
    stepRef.current = 0
    if (running) {
      const total = fullData.t.length - 1
      const animate = () => {
        stepRef.current = Math.min(stepRef.current + 2, total)
        draw(stepRef.current / total)
        if (stepRef.current < total)
          frameRef.current = requestAnimationFrame(animate)
      }
      frameRef.current = requestAnimationFrame(animate)
    } else {
      draw(1) // show full curve when paused
    }
    return () => cancelAnimationFrame(frameRef.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, fullData, domain])

  // resize
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ro = new ResizeObserver(() => {
      const dpr = window.devicePixelRatio || 1
      canvas.width  = canvas.offsetWidth  * dpr
      canvas.height = canvas.offsetHeight * dpr
      const ctx = canvas.getContext('2d')
      ctx.scale(dpr, dpr)
      draw(running ? stepRef.current / (fullData?.t.length - 1 || 1) : 1)
    })
    ro.observe(canvas)
    return () => ro.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullData, running, domain])

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '100%', background: '#020202' }}
    />
  )
}
