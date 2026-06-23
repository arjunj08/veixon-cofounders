'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import ThemeToggle from '@/components/ui/ThemeToggle'
import LogoButton from '@/components/ui/LogoButton'

const ease = [0.25, 0.1, 0.25, 1] as const

export default function Navbar({ loadStep = 0 }: { loadStep?: number }) {
  const [open, setOpen] = useState(false)
  const visible = loadStep >= 3

  return (
    <>
      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: visible ? 0 : -64, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.5, ease }}
        className="fixed inset-x-0 top-0 z-50 h-16 border-b-0 backdrop-blur-sm"
        style={{ background: 'transparent', borderColor: 'transparent' }}
      >
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex h-9 items-center">
            <Image
              src="/logos/clusterx.png"
              alt="CLUSTERX Logo"
              width={140}
              height={36}
              priority
              className="h-9 w-auto"
            />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {[
              ['How it works', '#how-it-works'],
              ['Features', '#features'],
            ].map(([label, href]) => (
              <a key={label} href={href} className="text-sm transition-colors hover:text-[var(--text-primary)]" style={{ color: 'var(--text-muted)' }}>
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/auth"
              className="hidden rounded-lg bg-[var(--purple)] px-4 py-2 text-sm font-medium text-white transition-all hover:brightness-110 hover:shadow-[0_0_20px_color-mix(in_srgb,var(--purple)_40%,transparent)] md:inline-flex"
            >
              Get started
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="focus-ring grid h-9 w-9 place-items-center rounded-lg border md:hidden"
              style={{ borderColor: 'var(--border)' }}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.header>

      {open && (
        <motion.div
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          className="fixed inset-0 z-[60] flex flex-col bg-[var(--bg-primary)] p-8"
        >
          <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="self-end">
            <X className="h-6 w-6" />
          </button>
          <div className="mt-10 flex flex-col gap-6 text-3xl font-semibold">
            {[
              ['How it works', '#how-it-works'],
              ['Features', '#features'],
            ].map(([label, href]) => (
              <a key={label} href={href} onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
          </div>
          <Link href="/auth" className="mt-10 rounded-xl bg-[var(--purple)] px-5 py-3 text-center font-semibold text-white">
            Get started
          </Link>
        </motion.div>
      )}
    </>
  )
}
