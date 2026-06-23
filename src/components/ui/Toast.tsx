'use client'

import { motion } from 'framer-motion'

export default function Toast({ message }: { message: string }) {
  if (!message) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="fixed bottom-5 left-1/2 z-[100] -translate-x-1/2 rounded-lg border px-4 py-2 text-sm shadow-lg"
      style={{ background: 'var(--card-bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
    >
      {message}
    </motion.div>
  )
}
