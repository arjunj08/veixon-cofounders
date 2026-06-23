'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

const tiers = [
  {
    name: 'Free',
    price: 'Rs 0',
    cta: 'Start free',
    style: 'ghost',
    features: ['1 idea analysis', '3 decisions', '30 day access', 'basic war plan'],
  },
  {
    name: 'Founders',
    price: 'Rs 999',
    cta: 'Get Founders',
    style: 'purple',
    popular: true,
    features: ['unlimited decisions', '90-day war plan', 'pivot radar', 'VZN missiles', 'VC vault'],
  },
  {
    name: 'Team',
    price: 'Rs 2,499',
    cta: 'Build with team',
    style: 'teal',
    features: ['5 co-founders', 'investor report', 'vault early access', 'autopsy mode'],
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="relative z-10 px-6 py-[120px]">
      <div className="mx-auto mb-12 max-w-[760px] text-center">
        <h2 className="text-[34px] font-bold md:text-[42px]">Simple, founder-friendly pricing.</h2>
        <p className="mt-3" style={{ color: 'var(--text-muted)' }}>Start free. Upgrade when VZN gives you a reason to.</p>
      </div>

      <div className="mx-auto grid max-w-[960px] gap-5 md:grid-cols-3" style={{ perspective: 1200 }}>
        {tiers.map((tier, index) => (
          <motion.article
            key={tier.name}
            initial={{ opacity: 0, rotateX: 90, y: 40 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="relative flex rounded-2xl border p-8 transition-transform duration-200 hover:scale-[1.02]"
            style={{
              background: 'var(--card-bg)',
              borderColor: tier.popular ? 'var(--purple)' : 'var(--border)',
              borderWidth: tier.popular ? 2 : 1,
              boxShadow: tier.popular ? '0 0 40px var(--card-glow)' : 'none',
              transform: tier.popular ? 'scale(1.04)' : undefined,
            }}
          >
            {tier.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--purple)] px-4 py-1 text-xs font-semibold text-white">
                Most popular
              </span>
            )}
            <div className="flex w-full flex-col">
              <div className="text-[13px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{tier.name}</div>
              <div className="mt-3 text-5xl font-bold">
                {tier.price}<span className="text-base font-normal" style={{ color: 'var(--text-muted)' }}>/mo</span>
              </div>
              <ul className="my-8 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <CheckCircle2 className="h-4 w-4 text-[var(--purple)]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth"
                className="mt-auto rounded-xl px-4 py-3 text-center text-sm font-semibold text-white"
                style={{
                  background: tier.style === 'teal' ? 'var(--teal)' : tier.style === 'purple' ? 'var(--purple)' : 'transparent',
                  border: tier.style === 'ghost' ? '1px solid var(--border)' : undefined,
                  color: tier.style === 'ghost' ? 'var(--text-primary)' : 'white',
                }}
              >
                {tier.cta}
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
