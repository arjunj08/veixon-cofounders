'use client'

import { motion } from 'framer-motion'
import { Zap, ChevronDown } from 'lucide-react'
import { SplitText } from './interactions'
import IdeaConsole from './IdeaConsole'

export default function Hero() {
  return (
    <section className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 py-28 text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card-bg)] px-3.5 py-1.5 backdrop-blur-md"
      >
        <Zap className="h-3.5 w-3.5 text-[var(--text-primary)]" />
        <span className="text-[13px] text-[var(--text-muted)]">Powered by Claude Sonnet 4</span>
      </motion.div>

      <h1 className="max-w-[840px] font-bold leading-[1.02] tracking-[-0.02em] text-[var(--text-primary)]">
        <span className="block text-[34px] sm:text-[46px] lg:text-[60px]">
          <SplitText text="Your AI Co-Founder" />
        </span>
        <span
          className="block bg-clip-text text-[42px] text-transparent sm:text-[58px] lg:text-[74px]"
          style={{ backgroundImage: 'linear-gradient(110deg, var(--text-primary), var(--text-muted))' }}
        >
          <SplitText text="from Day One." />
        </span>
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="mx-auto mt-5 max-w-[520px] text-base leading-relaxed text-[var(--text-muted)]"
      >
        Brutal scorecard. 90-day war plan. Devil&apos;s advocate. Decision simulator. Weekly accountability.
      </motion.p>

      {/* idea capture + instant teaser — value before signup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="w-full"
      >
        <IdeaConsole />
      </motion.div>

      <motion.a
        href="#how-it-works"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="mt-6 text-sm text-[var(--text-muted)] underline-offset-4 hover:underline"
      >
        Or see how it works
      </motion.a>

      <motion.div
        animate={{ y: [0, 9, 0], opacity: [0.6, 0.25, 0.6] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--text-muted)]"
      >
        <ChevronDown className="h-6 w-6" />
      </motion.div>
    </section>
  )
}
