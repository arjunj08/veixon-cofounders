'use client'

import { useEffect, useRef, useState } from 'react'
import { Reveal } from './interactions'

export function Marquee() {
  const items = ['Brutal scorecard', '90-day war plan', "Devil's advocate", 'Decision simulator', 'Pivot radar', 'Founder DNA', 'VC vault', 'Accountability score']
  const row = (
    <span className="inline-block">
      {items.map((i) => (
        <span key={i} className="mx-7 text-[clamp(16px,2.6vw,28px)] font-extrabold tracking-[-0.02em] text-[var(--text-muted)]">
          {i} <span className="text-[var(--text-primary)]">/</span>
        </span>
      ))}
    </span>
  )
  return (
    <div className="relative z-10 overflow-hidden border-y border-[var(--border)] py-6" style={{ maskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)', WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)' }}>
      <div className="inline-block whitespace-nowrap" style={{ animation: 'veixon-scrollx 26s linear infinite' }}>
        {row}{row}
      </div>
    </div>
  )
}

function CountUp({ to }: { to: number }) {
  const [v, setV] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          const start = performance.now()
          const tick = (n: number) => {
            const t = Math.min(1, (n - start) / 1500)
            setV(Math.round((1 - Math.pow(1 - t, 3)) * to))
            if (t < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          io.disconnect()
        }
      })
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [to])
  return <div ref={ref}>{v}</div>
}

export function Stats() {
  const stats: [number, string][] = [[90, 'Days of execution'], [13, 'Weekly missions'], [6, 'Scorecard dimensions'], [20, 'VCs in the vault']]
  return (
    <section className="relative z-10 px-6 py-[120px]">
      <div className="mx-auto grid max-w-[1000px] grid-cols-2 gap-5 md:grid-cols-4">
        {stats.map(([n, l], i) => (
          <Reveal key={l} delay={i * 0.08} className="text-center">
            <div className="text-[clamp(28px,4.5vw,46px)] font-extrabold leading-none tracking-[-0.03em] text-[var(--text-primary)]">
              <CountUp to={n} />
            </div>
            <div className="mt-2 text-[13px] text-[var(--text-muted)]">{l}</div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function FinalCTA() {
  return (
    <section className="relative z-10 grid min-h-[80vh] place-items-center px-6 text-center">
      <Reveal>
        <h2 className="text-[clamp(30px,5.5vw,58px)] font-extrabold leading-[0.95] tracking-[-0.03em] text-[var(--text-primary)]">
          Stop guessing.
          <br />
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(110deg, var(--text-primary), var(--text-muted))' }}>Start shipping.</span>
        </h2>
        <a href="#top" className="mt-9 inline-flex rounded-full bg-[var(--text-primary)] px-9 py-4 text-[17px] font-bold text-[var(--bg-primary)] transition-transform active:scale-95 hover:opacity-90">
          Analyse my idea — free
        </a>
        <p className="mt-4 text-[13px] text-[var(--text-muted)]">No credit card · 1 free analysis · Built in India</p>
      </Reveal>
    </section>
  )
}
