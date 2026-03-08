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

  // cursor + scroll progress (DOM-direct, no re-renders)
  const dotRef      = useRef(null)
  const ringRef     = useRef(null)
  const progressRef = useRef(null)
  const _mouse = useRef({ x: -100, y: -100 })
  const _ring  = useRef({ x: -100, y: -100 })

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

    const sectionObs = new IntersectionObserver(
      (entries) => entries.forEach(e => e.target.classList.toggle('section-active', e.isIntersecting)),
      { threshold: 0.35 }
    )
    ;['problem','vision','domains','architecture','techstack','research','devguide','roadmap']
      .forEach(id => { const el = document.getElementById(id); if (el) sectionObs.observe(el) })

    return () => { observer.disconnect(); sectionObs.disconnect() }
  }, [splashDone])

  // cursor tracking + scroll progress bar
  useEffect(() => {
    document.body.classList.add('has-cursor')
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      if (progressRef.current)
        progressRef.current.style.width = (scrollTop / (scrollHeight - clientHeight)) * 100 + '%'
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    const onMove = (e) => {
      _mouse.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px'
        dotRef.current.style.top  = e.clientY + 'px'
      }
      const isHover = e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || !!e.target.closest('a,button')
      ringRef.current?.classList.toggle('hover', isHover)
    }
    window.addEventListener('mousemove', onMove)
    let raf
    const animRing = () => {
      _ring.current.x += (_mouse.current.x - _ring.current.x) * 0.15
      _ring.current.y += (_mouse.current.y - _ring.current.y) * 0.15
      if (ringRef.current) {
        ringRef.current.style.left = _ring.current.x + 'px'
        ringRef.current.style.top  = _ring.current.y + 'px'
      }
      raf = requestAnimationFrame(animRing)
    }
    raf = requestAnimationFrame(animRing)
    return () => {
      document.body.classList.remove('has-cursor')
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (isMobile) return <MobileBlock />

  return (
    <>
      <div ref={dotRef}      className="cursor-dot"      style={{ left: '-100px', top: '-100px' }} />
      <div ref={ringRef}     className="cursor-ring"     style={{ left: '-100px', top: '-100px' }} />
      <div ref={progressRef} className="scroll-progress" style={{ width: '0%' }} />
      {!splashDone && <Splash onDone={() => {
        window.scrollTo({ top: 0, behavior: 'instant' })
        setSplashDone(true)
      }} />}

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
