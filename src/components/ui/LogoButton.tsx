'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function LogoButton({ size = 'sm', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const [showModal, setShowModal] = useState(false)

  const sizeMap = {
    sm: 'h-9 w-9',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`rounded-full border-2 border-[var(--purple)] bg-[var(--purple)]/10 p-1 transition-all hover:border-[var(--purple)] hover:bg-[var(--purple)]/20 hover:shadow-lg hover:shadow-[var(--purple)]/20 ${sizeMap[size]} ${className}`}
        title="Click to view full logo"
      >
        <Image
          src="/logos/clusterx.png"
          alt="CLUSTERX Logo"
          width={64}
          height={64}
          className="h-full w-full rounded-full object-cover"
          priority
        />
      </button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex flex-col items-center gap-6 rounded-3xl border p-8"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 rounded-full p-2 transition-colors hover:bg-[var(--bg-tertiary)]"
              >
                <X size={24} />
              </button>

              <div className="relative h-48 w-48 rounded-2xl border-2 border-[var(--purple)]/20 bg-[var(--bg-primary)] p-4">
                <Image
                  src="/logos/clusterx.png"
                  alt="CLUSTERX Full Logo"
                  width={256}
                  height={256}
                  className="h-full w-full rounded-lg object-contain"
                  priority
                />
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold">CLUSTERX</h2>
                <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  Powering VEIXON Co-founders
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg px-6 py-2 text-sm font-semibold transition-colors"
                style={{ background: 'var(--purple)', color: 'white' }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
