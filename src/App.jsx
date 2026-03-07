import { useEffect, useRef, useState } from 'react'
import MobileBlock from './components/MobileBlock'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SplineBackground from './components/SplineBackground'
import Splash from './components/Splash'
import Problem from './components/Problem'
import Vision from './components/Vision'
import Domains from './components/Domains'
import Architecture from './components/Architecture'
import TechStack from './components/TechStack'
import Research from './components/Research'
import DevGuide from './components/DevGuide'
import Roadmap from './components/Roadmap'
import Footer from './components/Footer'

export default function App() {
  const [splashDone, setSplashDone] = useState(false)
  const [isMobile, setIsMobile]   = useState(() => window.innerWidth < 1024)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  if (isMobile) return <MobileBlock />

  return (
    <>
      {!splashDone && <Splash onDone={() => setSplashDone(true)} />}

      <div style={{ background: 'transparent', minHeight: '100vh', position: 'relative' }}>
        {/* Fixed parallax canvas — sits at z:0, visible behind ALL sections */}
        <SplineBackground />

        {/* All content — sections each have their OWN semi-transparent bg */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Navbar />
          <Hero />
          <hr className="rule" />
          <Problem />
          <hr className="rule" />
          <Vision />
          <hr className="rule" />
          <Domains />
          <hr className="rule" />
          <Architecture />
          <hr className="rule" />
          <TechStack />
          <hr className="rule" />
          <Research />
          <hr className="rule" />
          <DevGuide />
          <hr className="rule" />
          <Roadmap />
          <Footer />
        </div>
      </div>
    </>
  )
}
