import { useEffect, useState } from 'react'

export default function Navbar() {
  const [active, setActive] = useState('')

  useEffect(() => {
    const ids = ['problem', 'vision', 'domains', 'architecture', 'techstack', 'wireframes', 'devguide', 'roadmap']
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }),
      { threshold: 0.35 }
    )
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: '52px',
        background: 'rgba(0,0,0,0.92)',
        borderBottom: '1px solid #1c1c1c',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
        justifyContent: 'space-between',
      }}
    >
      {/* Logo */}
      <a
        href="#"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            background: '#c8ff00',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: '13px',
              color: '#000',
              letterSpacing: '-0.02em',
            }}
          >
            CL
          </span>
        </div>
        <span
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: '15px',
            color: '#e8e6e3',
            letterSpacing: '-0.01em',
          }}
        >
          CosmosLab
        </span>
      </a>

      {/* Nav links */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
        }}
      >
        {[
          ['Problem',      '#problem'     ],
          ['Vision',       '#vision'      ],
          ['Domains',      '#domains'     ],
          ['Architecture', '#architecture'],
          ['Tech',         '#techstack'   ],
          ['Roadmap',      '#roadmap'     ],
        ].map(([label, href]) => {
          const isActive = active === href.slice(1)
          return (
            <a
              key={label}
              href={href}
              className={isActive ? 'nav-active' : ''}
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: isActive ? '#c8ff00' : '#555',
                textDecoration: 'none',
                transition: 'color 0.2s',
                position: 'relative',
              }}
              onMouseEnter={(e) => (e.target.style.color = '#e8e6e3')}
              onMouseLeave={(e) => (e.target.style.color = isActive ? '#c8ff00' : '#555')}
            >
              {label}
            </a>
          )
        })}

        <a href="#devguide" className="btn-primary" style={{ padding: '6px 14px', fontSize: '11px' }}>
          Dev Guide
        </a>
      </div>
    </nav>
  )
}
