'use client'

import { useMemo } from 'react'

export default function Sparkles() {
  // a few large, prominent flares (like the reference) + smaller scattered ones
  const stars = useMemo(() => {
    const big = [
      { left: 84, top: 14, s: 5, flare: 84 },
      { left: 68, top: 26, s: 4, flare: 64 },
      { left: 24, top: 20, s: 4, flare: 60 },
      { left: 90, top: 52, s: 3.5, flare: 56 },
    ]
    const small = Array.from({ length: 7 }, () => ({ left: 5 + Math.random() * 90, top: 6 + Math.random() * 64, s: 2 + Math.random() * 1.5, flare: 34 + Math.random() * 16 }))
    return [...big, ...small].map((x) => ({ ...x, delay: Math.random() * 4 }))
  }, [])
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[2]">
      {stars.map((s, i) => (
        <span
          key={i}
          className="veixon-spark"
          style={{ width: s.s, height: s.s, left: `${s.left}vw`, top: `${s.top}vh`, animationDelay: `${s.delay}s`, ['--flare' as any]: `${s.flare}px` }}
        />
      ))}
    </div>
  )
}
