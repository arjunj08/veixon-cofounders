'use client'

import { MouseEvent, useRef } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, Radar, Target, TrendingUp } from 'lucide-react'

const features = [
  [Lightbulb, 'AI Ideation Engine', '6-dimension scorecard, devil&apos;s advocate, failure probability, Founder DNA profile', { x: -60, y: -60 }],
  [TrendingUp, 'Decision Simulator', '3 scenarios: best/worst/most likely with 30, 90, 180-day projections', { x: 60, y: -60 }],
  [Radar, 'Pivot Radar', 'VEIXON Co-founders watches weekly patterns and alerts you before you realise you are failing', { x: -60, y: 60 }],
  [Target, 'Accountability Score', 'Your follow-through rate. Tracked every week. The number VCs will ask to see.', { x: 60, y: 60 }],
] as const

function FeatureCard({ item, index }: { item: (typeof features)[number]; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [Icon, title, body, from] = item

  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    node.style.transition = 'transform 80ms ease'
    node.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`
    node.style.boxShadow = '0 20px 60px var(--card-glow)'
  }

  const onLeave = () => {
    const node = ref.current
    if (!node) return
    node.style.transition = 'transform 300ms ease, box-shadow 300ms ease'
    node.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)'
    node.style.boxShadow = 'none'
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...from }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="will-change-transform rounded-2xl border border-l-[3px] border-l-[var(--purple)] p-7"
      style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}
    >
      <Icon className="mb-4 h-7 w-7 text-[var(--purple)]" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }} dangerouslySetInnerHTML={{ __html: body }} />
    </motion.div>
  )
}

export default function Features() {
  return (
    <section id="features" className="relative z-10 px-6 py-[120px]">
      <div className="mx-auto mb-12 max-w-[760px] text-center">
        <h2 className="text-[34px] font-bold md:text-[42px]">Built for founders who hate fluff.</h2>
        <p className="mt-3" style={{ color: 'var(--text-muted)' }}>Everything your co-founder should be.</p>
      </div>
      <div className="mx-auto grid max-w-[880px] gap-5 md:grid-cols-2">
        {features.map((feature, index) => <FeatureCard key={feature[1]} item={feature} index={index} />)}
      </div>
    </section>
  )
}
