const links = [
  { label: 'Problem',      href: '#problem'      },
  { label: 'Vision',       href: '#vision'       },
  { label: 'Domains',      href: '#domains'      },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Tech Stack',   href: '#techstack'    },
  { label: 'Wireframes',   href: '#wireframes'   },
  { label: 'Dev Guide',    href: '#devguide'     },
  { label: 'Roadmap',      href: '#roadmap'      },
]

export default function Footer() {
  return (
    <footer style={{ background: '#000', borderTop: '1px solid #1c1c1c' }}>
      {/* Nav grid */}
      <div style={{ padding: '64px 80px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
        {/* Wordmark */}
        <div>
          <div style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 'clamp(3rem, 7vw, 6rem)', lineHeight: 0.88,
            letterSpacing: '-0.03em', color: '#e8e6e3', marginBottom: '24px',
          }}>
            COS<span style={{ color: '#c8ff00' }}>MOS</span>LAB
          </div>
          <p style={{ color: '#444', fontSize: '14px', lineHeight: 1.7, maxWidth: '360px' }}>
            A unified simulation engine for complex dynamical systems. Pandemic.
            Ecosystem. Evolution. One platform.
          </p>
        </div>

        {/* Links */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#1c1c1c', alignSelf: 'start' }}>
          {links.map(({ label, href }) => (
            <a key={label} href={href} style={{
              display: 'block', padding: '14px 20px',
              background: '#080808',
              fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
              color: '#444', letterSpacing: '0.1em', textDecoration: 'none',
              transition: 'color 0.15s, background 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#c8ff00'; e.currentTarget.style.background = '#0a0a0a' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#444'; e.currentTarget.style.background = '#080808' }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ padding: '32px 80px', marginTop: '64px', borderTop: '1px solid #0d0d0d', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#444', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          CosmosLab © 2026 — Complex Systems Simulation Platform
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '5px', height: '5px', background: '#c8ff00', display: 'inline-block' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#c8ff0060', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            v2.0 — Beta
          </span>
        </div>
      </div>
    </footer>
  )
}
