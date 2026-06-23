'use client'

import { motion } from 'framer-motion'

const steps = [
  ['01', 'Share your idea', 'Three precise questions. No pitch deck.'],
  ['02', 'VEIXON Co-founders deep-analyses it', 'A six-dimension scorecard plus the failure modes you are avoiding.'],
  ['03', 'Get your 90-day war plan', 'Thirteen weekly missions, each with daily execution tasks.'],
  ['04', 'Ship and stay accountable', 'Weekly check-ins, pivot radar, and execution pressure.'],
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative z-10 px-6 py-[120px]">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-[900px] text-center"
      >
        <h2 className="text-[34px] font-bold md:text-[42px]">From idea to execution in 4 steps</h2>
        <p className="mt-3" style={{ color: 'var(--text-muted)' }}>VEIXON Co-founders guides you from raw idea to funded startup.</p>
      </motion.div>

      <div className="relative mx-auto mt-12 flex max-w-[900px] flex-col gap-4 md:flex-row md:gap-0">
        <motion.svg
          className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-full -translate-x-1/2 md:block"
          viewBox="0 0 900 200"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1 }}
        >
          <motion.path d="M110 72 H790" stroke="var(--purple)" strokeWidth="1.5" fill="none" strokeDasharray="8 8" />
        </motion.svg>
        {steps.map(([number, title, body], index) => (
          <motion.article
            key={number}
            initial={{ opacity: 0, y: 40, rotateX: 15 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
            className="relative flex-1 border p-8 transition-all hover:border-t-2 hover:border-t-[var(--purple)]"
            style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}
          >
            <div className="mb-4 grid h-10 w-10 place-items-center rounded-full border-2 border-[var(--purple)] text-lg font-bold text-[var(--purple)]">
              {number}
            </div>
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{body}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
