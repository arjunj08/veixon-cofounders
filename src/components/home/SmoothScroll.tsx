'use client'

import { useEffect, useRef, type ReactNode } from 'react'

// Lenis-style inertia smooth scroll (dependency-free). The visible content lives in a
// fixed, translated wrapper that eases toward window.scrollY, while the real page height
// is mirrored onto <body> so the scrollbar + the 3D journey (which reads window.scrollY)
// both stay in sync.
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (typeof window === 'undefined') return
    // honor reduced-motion: fall back to native scroll
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    if (!el) return

    let cur = window.scrollY
    let target = window.scrollY
    let raf = 0

    const setHeight = () => { document.body.style.height = `${el.scrollHeight}px` }
    const ro = new ResizeObserver(setHeight)
    ro.observe(el)
    setHeight()

    const onScroll = () => { target = window.scrollY }
    window.addEventListener('scroll', onScroll, { passive: true })

    const loop = () => {
      cur += (target - cur) * 0.09
      if (Math.abs(target - cur) < 0.05) cur = target
      el.style.transform = `translate3d(0, ${-cur}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
      document.body.style.height = ''
      el.style.transform = ''
    }
  }, [])

  return (
    <div ref={ref} style={{ position: 'fixed', top: 0, left: 0, width: '100%', willChange: 'transform' }}>
      {children}
    </div>
  )
}
