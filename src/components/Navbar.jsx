export default function Navbar() {
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
          ['Problem', '#problem'],
          ['Vision', '#vision'],
          ['Domains', '#domains'],
          ['Architecture', '#architecture'],
          ['Tech', '#techstack'],
          ['Roadmap', '#roadmap'],
        ].map(([label, href]) => (
          <a
            key={label}
            href={href}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#555',
              textDecoration: 'none',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => (e.target.style.color = '#e8e6e3')}
            onMouseLeave={(e) => (e.target.style.color = '#555')}
          >
            {label}
          </a>
        ))}

        <a href="#devguide" className="btn-primary" style={{ padding: '6px 14px', fontSize: '11px' }}>
          Dev Guide
        </a>
      </div>
    </nav>
  )
}
