'use client'

import { motion } from 'framer-motion'
import VZNAvatar from '@/components/ui/VZNAvatar'

export default function VZNReveal() {
  return (
    <section className="relative z-10 overflow-hidden px-6 py-[140px] text-center">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
        style={{ background: 'radial-gradient(circle at center, color-mix(in srgb, var(--purple) 5%, transparent), transparent 58%)' }}
      />
      <div className="relative mx-auto flex max-w-2xl flex-col items-center">
        <VZNAvatar size="xl" />
        <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-8 text-[44px] font-bold md:text-[52px]">
          Meet VEIXON Co-founders.
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mt-3 text-xl" style={{ color: 'var(--text-muted)' }}>
          Your AI co-founder. Brutally honest. Always watching.
        </motion.p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {['No sugarcoating', 'No cheerleading', 'No mercy'].map((pill, index) => (
            <motion.span
              key={pill}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="rounded-full border px-4 py-1.5 text-sm"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            >
              {pill}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  )
}
