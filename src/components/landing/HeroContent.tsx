'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronDown, Zap } from 'lucide-react'

const ease = [0.25, 0.1, 0.25, 1] as const

function fadeStep(step: number, activeStep: number, y = 30) {
  return {
    initial: { opacity: 0, y },
    animate: { opacity: activeStep >= step ? 1 : 0, y: activeStep >= step ? 0 : y },
    transition: { duration: 0.55, ease },
  }
}

export default function HeroContent({ loadStep = 0 }: { loadStep?: number }) {
  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <motion.div
        {...fadeStep(4, loadStep, 20)}
        className="mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1"
        style={{ borderColor: 'var(--purple)', background: 'color-mix(in srgb, var(--purple) 8%, transparent)' }}
      >
        <Zap className="h-3.5 w-3.5 text-[var(--amber)]" />
        <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>Powered by Claude Sonnet 4</span>
      </motion.div>

      <h1 className="max-w-[760px] font-bold leading-[1.05] tracking-normal">
        <motion.div {...fadeStep(5, loadStep)} className="text-[42px] text-[var(--text-primary)] sm:text-[56px] lg:text-[72px]">
          Your AI Co-Founder
        </motion.div>
        <motion.div {...fadeStep(6, loadStep)} className="text-[42px] text-[var(--purple)] sm:text-[56px] lg:text-[72px]">
          from Day One.
        </motion.div>
      </h1>

      <motion.p {...fadeStep(7, loadStep, 20)} className="mx-auto mt-6 max-w-[500px] text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        Brutal scorecard. 90-day war plan. Devil&apos;s advocate. Decision simulator. Weekly accountability.
      </motion.p>

      <motion.div {...fadeStep(8, loadStep, 18)} className="mt-9 flex flex-wrap justify-center gap-3">
        <Link
          href="/auth"
          className="rounded-xl bg-[var(--purple)] px-7 py-3.5 text-base font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
          style={{ boxShadow: '0 0 0 transparent' }}
        >
          Analyse my idea - free
        </Link>
        <a
          href="#how-it-works"
          className="rounded-xl border px-7 py-3.5 text-base font-medium transition-all hover:bg-white/5"
          style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
        >
          See how it works
        </a>
      </motion.div>

      <motion.p {...fadeStep(8, loadStep, 12)} className="mt-4 text-[13px]" style={{ color: 'var(--text-muted)' }}>
        No credit card · 1 free analysis · Built in India
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={loadStep >= 9 ? { y: [0, 8, 0], opacity: [1, 0.4, 1] } : { opacity: 0 }}
        transition={loadStep >= 9 ? { duration: 2, repeat: Infinity } : { duration: 0.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        style={{ color: 'var(--text-muted)' }}
      >
        <ChevronDown className="h-6 w-6" />
      </motion.div>
    </section>
  )
}
