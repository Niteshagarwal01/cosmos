import { useEffect, useMemo, useRef, useState } from 'react'
import { flowTextAroundFloats } from '../modules/pretextFlow'

const STORY = `The next interface leap will not come from another button style. It will come from text behaving like a living surface. Paragraphs can bend around signal cards, model snapshots, and warning chips while keeping rhythm, readability, and narrative flow. In print, this was normal craft. On the web, it stayed awkward for years because layout had to be guessed from the DOM after render.

Pretext flips the order. We compute line breaks first, with real text shaping, then place lines exactly where they should land. That means we can route language around embedded modules, reserve breathing room for critical metrics, and still keep every sentence coherent.

For simulation products like COSMOSLAB, this matters. Scientific stories are dense. You need context, values, and status in one viewport without collapsing into dashboard noise. Fluid editorial layout gives us a third mode between plain paragraphs and rigid cards.

Design-wise, this unlocks interfaces that feel intentional: less template, more publication. Engineering-wise, it removes expensive measurement loops and gives deterministic text behavior that can scale from DOM to canvas and eventually server-rendered previews.`

const FONT = '400 16px Space Grotesk'
const LINE_HEIGHT = 30

export default function PretextLab() {
  const containerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const update = () => setContainerWidth(node.clientWidth)
    update()

    const ro = new ResizeObserver(update)
    ro.observe(node)

    return () => ro.disconnect()
  }, [])

  const floatWidth = useMemo(
    () => Math.max(180, Math.min(270, Math.round(containerWidth * 0.28))),
    [containerWidth],
  )

  const floats = useMemo(
    () => [
      {
        id: 'signal-card',
        side: 'right',
        top: 24,
        width: floatWidth,
        height: 170,
        gutter: 24,
      },
      {
        id: 'bridge-card',
        side: 'left',
        top: 254,
        width: floatWidth,
        height: 160,
        gutter: 24,
      },
      {
        id: 'latency-card',
        side: 'right',
        top: 480,
        width: floatWidth,
        height: 172,
        gutter: 24,
      },
    ],
    [floatWidth],
  )

  const compact = containerWidth > 0 && containerWidth < 760

  const flow = useMemo(() => {
    if (!containerWidth) return { lines: [], totalHeight: 0 }

    return flowTextAroundFloats({
      text: STORY,
      font: FONT,
      lineHeight: LINE_HEIGHT,
      containerWidth,
      paddingBottom: 24,
      floats: compact ? [] : floats,
    })
  }, [compact, containerWidth, floats])

  return (
    <section id="pretextlab" style={{ padding: '0', background: '#000', overflow: 'hidden' }}>
      <div className="fade-in" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '20px', padding: '22px 80px', borderTop: '1px solid #161616', borderBottom: '1px solid #161616', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, height: '2px', width: '100%', background: 'linear-gradient(90deg, transparent 0%, #c8ff00 50%, transparent 100%)', animation: 'scanBar 3s ease-in-out infinite' }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#c8ff0088', letterSpacing: '0.25em', textTransform: 'uppercase', textShadow: '0 0 12px #c8ff0055' }}>07 — Text Flow Lab</span>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #c8ff0022, transparent)' }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#333', letterSpacing: '0.2em' }}>PRETEXT · WRAPPED LAYOUT · NO DOM MEASURE LOOP</span>
      </div>

      <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 300px) 1fr', gap: '1px', background: '#101010' }}>
        <div style={{ background: '#040404', padding: '42px 36px', borderRight: '1px solid #111' }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 3.2vw, 3rem)', lineHeight: 0.9, letterSpacing: '-0.03em', color: '#e8e6e3', margin: '0 0 20px 0' }}>
            PIXEL-LEVEL<br />
            <span style={{ color: '#c8ff00' }}>TEXT FLOW</span>
          </h3>
          <p style={{ margin: 0, color: '#5f5f5f', lineHeight: 1.8, fontSize: '14px' }}>
            A live paragraph with cards embedded inside the reading block. The text wraps around each card using Pretext line routing, not post-render hacks.
          </p>
        </div>

        <div style={{ background: '#050505', padding: '38px 34px 42px' }}>
          <div ref={containerRef} style={{ position: 'relative', width: '100%', minHeight: '640px' }}>
            {!compact && floats.map((item) => {
              const right = item.side === 'right'
              const chip = item.id === 'signal-card' ? 'MODEL SIGNAL' : item.id === 'bridge-card' ? 'DOMAIN BRIDGE' : 'RENDER SPEED'
              const value = item.id === 'signal-card' ? '+19% coherence' : item.id === 'bridge-card' ? '3 systems coupled' : '0.09ms layout'

              return (
                <article
                  key={item.id}
                  className="card-lift"
                  style={{
                    position: 'absolute',
                    top: item.top,
                    width: item.width,
                    height: item.height,
                    [right ? 'right' : 'left']: 0,
                    border: '1px solid #202020',
                    background: 'linear-gradient(180deg, rgba(12,12,12,0.96), rgba(5,5,5,0.98))',
                    padding: '16px 16px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <span className="tag-lime">{chip}</span>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '20px', lineHeight: 1, color: '#e8e6e3' }}>{value}</div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', letterSpacing: '0.12em', color: '#3f3f3f' }}>FLOATING ANCHOR</span>
                </article>
              )
            })}

            {compact ? (
              <div style={{ display: 'grid', gap: '12px' }}>
                <p style={{ margin: 0, color: '#9b9b9b', lineHeight: 1.9, fontSize: '16px' }}>{STORY}</p>
                {floats.map((item) => (
                  <div key={item.id} className="box" style={{ padding: '14px 16px', borderColor: '#202020', background: '#0a0a0a' }}>
                    <span className="tag">{item.id.replace('-', ' ')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ position: 'relative', height: flow.totalHeight }}>
                {flow.lines.map((line, index) => (
                  <div
                    key={`${index}-${line.y}`}
                    style={{
                      position: 'absolute',
                      top: line.y,
                      left: line.x,
                      width: line.width,
                      height: LINE_HEIGHT,
                      font: FONT,
                      lineHeight: `${LINE_HEIGHT}px`,
                      color: '#9b9b9b',
                      whiteSpace: 'pre',
                      letterSpacing: '0.005em',
                    }}
                  >
                    {line.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
