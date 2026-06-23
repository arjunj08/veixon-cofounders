'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Loader() {
  const [done, setDone] = useState(false)
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const iv = setInterval(() => setPct((p) => Math.min(100, p + Math.random() * 16)), 120)
    const t = setTimeout(() => setDone(true), 2300)
    return () => { clearInterval(iv); clearTimeout(t) }
  }, [])
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ y: '-100%' }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[200] grid place-items-center"
          style={{ background: 'var(--bg-primary)' }}
        >
          <div className="flex overflow-hidden text-[clamp(30px,7vw,78px)] font-extrabold tracking-[-0.04em] text-[var(--text-primary)]">
            {'VEIXON'.split('').map((c, i) => (
              <motion.span key={i} initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.1 + i * 0.07, duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="inline-block">
                {c}
              </motion.span>
            ))}
          </div>
          <div className="absolute bottom-9 right-9 text-[clamp(26px,5vw,56px)] font-extrabold tabular-nums text-[var(--text-muted)]">{Math.floor(pct)}</div>
          <div className="absolute bottom-0 left-0 h-0.5 bg-[var(--text-primary)]" style={{ width: pct + '%' }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
