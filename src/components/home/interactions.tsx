'use client'

import Link from 'next/link'
import { motion, useMotionValue, useSpring, type Variants } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

// Magnetic, glowing CTA that drifts toward the cursor and snaps back.
export function MagneticButton({
  href,
  children,
  variant = 'primary',
  className = '',
}: {
  href: string
  children: ReactNode
  variant?: 'primary' | 'ghost'
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 })

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    x.set((e.clientX - (r.left + r.width / 2)) * 0.4)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.4)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  const base =
    'group relative inline-flex items-center justify-center rounded-full px-7 py-3.5 text-base font-semibold tracking-tight transition-transform duration-150 active:scale-95'
  const skin =
    variant === 'primary'
      ? 'text-[var(--bg-primary)]'
      : 'text-[var(--text-primary)] border border-[var(--border)] bg-[var(--card-bg)] backdrop-blur-md hover:border-[var(--text-primary)]'

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={reset} style={{ x: sx, y: sy }} className="inline-block will-change-transform">
      <Link href={href} className={`${base} ${skin} ${className}`}>
        {variant === 'primary' && (
          <span className="absolute inset-0 rounded-full" style={{ background: 'var(--text-primary)' }} />
        )}
        <span
          className="pointer-events-none absolute -inset-px rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ boxShadow: '0 0 32px -4px var(--text-primary)' }}
        />
        <span className="relative z-10">{children}</span>
      </Link>
    </motion.div>
  )
}

// 3D tilt + glare on hover.
export function TiltCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 150, damping: 14 })
  const sry = useSpring(ry, { stiffness: 150, damping: 14 })

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * 14)
    rx.set(-py * 14)
  }
  const reset = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d', transformPerspective: 900 }}
      className={`relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 hover:opacity-100"
        style={{ background: 'radial-gradient(600px circle at 50% 50%, color-mix(in srgb, var(--text-primary) 7%, transparent), transparent 45%)' }}
      />
      <div style={{ transform: 'translateZ(40px)' }}>{children}</div>
    </motion.div>
  )
}

// Scroll-into-view reveal with optional direction.
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = '',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-90px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Character-by-character headline reveal.
const charVar: Variants = {
  hidden: { opacity: 0, y: '0.5em', rotateX: -40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { delay: 0.2 + i * 0.03, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
}

export function SplitText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`inline-block ${className}`} style={{ perspective: 600 }} aria-label={text}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={charVar}
          initial="hidden"
          animate="show"
          className="inline-block will-change-transform"
          style={{ transformOrigin: 'bottom' }}
        >
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </span>
  )
}
