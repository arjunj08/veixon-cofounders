'use client'

import { useState } from 'react'
import AppShell from '@/components/AppShell'
import VZNAvatar from '@/components/ui/VZNAvatar'
import VaultProgress from '@/components/dashboard/VaultProgress'
import { Download, Lock, Mail, X } from 'lucide-react'

const vcs = [
  ['Sequoia India', 'Peak XV', 'Rs 5-50Cr', 'Seed-Growth'],
  ['Accel India', 'Accel', 'Rs 2-30Cr', 'Seed-Series B'],
  ['Blume Ventures', 'Blume', 'Rs 50L-5Cr', 'Pre-seed-Seed'],
  ['Elevation Capital', 'Elevation', 'Rs 5-50Cr', 'Seed-Series C'],
  ['Matrix Partners India', 'Matrix', 'Rs 3-25Cr', 'Seed-Series B'],
  ['Kalaari Capital', 'Kalaari', 'Rs 2-20Cr', 'Seed-Series A'],
  ['Lightspeed India', 'Lightspeed', 'Rs 5-40Cr', 'Seed-Growth'],
  ['3one4 Capital', '3one4', 'Rs 1-15Cr', 'Pre-seed-Series A'],
  ['Fireside Ventures', 'Fireside', 'Rs 1-10Cr', 'Seed-Series A'],
  ['Better Capital', 'Better', 'Rs 25L-3Cr', 'Pre-seed-Seed'],
  ['Antler India', 'Antler', 'Rs 50L-2Cr', 'Pre-seed'],
  ['Venture Catalysts', 'VCats', 'Rs 25L-5Cr', 'Seed'],
  ['Indian Angel Network', 'IAN', 'Rs 25L-5Cr', 'Seed'],
  ['Mumbai Angels', 'MA', 'Rs 25L-3Cr', 'Pre-seed-Seed'],
  ['100X.VC', '100X', 'Rs 25L-1Cr', 'Pre-seed'],
  ['Stellaris', 'Stellaris', 'Rs 3-20Cr', 'Seed-Series A'],
  ['Pravega', 'Pravega', 'Rs 1-8Cr', 'Seed'],
  ['Artha Venture', 'Artha', 'Rs 50L-3Cr', 'Pre-seed-Seed'],
  ['Fluid Ventures', 'Fluid', 'Rs 1-5Cr', 'Seed'],
  ['Cactus Partners', 'Cactus', 'Rs 1-10Cr', 'Seed-Series A'],
]

const defaultSlides = Array.from({ length: 12 }, (_, index) => ({
  slideNumber: index + 1,
  title: ['Problem', 'Customer', 'Solution', 'Why Now', 'Market', 'Traction', 'Product', 'Model', 'GTM', 'Competition', 'Team', 'Ask'][index],
  headline: 'Investor-grade proof goes here.',
  bullets: ['Use specific metrics.', 'Cut generic claims.', 'Show what changed.'],
  vznNote: 'Specific beats impressive.',
}))

export default function VaultClient({ startup, initialUnlocked, progress }: { startup: any; initialUnlocked: boolean; progress: any }) {
  const [unlocked] = useState(initialUnlocked)
  const [selectedVc, setSelectedVc] = useState<any>(null)
  const [email, setEmail] = useState<any>(null)
  const [slides, setSlides] = useState<any[]>(defaultSlides)
  const [slide, setSlide] = useState(0)

  async function requestIntro(vc: any) {
    setSelectedVc(vc)
    const res = await fetch('/api/ai/pitch-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile: startup, vc: { name: vc[0], fund: vc[1] } }),
    })
    setEmail(await res.json())
  }

  async function generateDeck() {
    const res = await fetch('/api/ai/pitch-deck', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile: startup }),
    })
    const data = await res.json()
    if (data.slides) setSlides([...data.slides, { slideNumber: 13, title: 'VZN Verification Badge', headline: 'Execution verified by VZN.', bullets: ['Scorecard complete.', 'War plan active.', 'Accountability tracked.'], vznNote: 'This badge means the founder executed before asking.' }])
  }

  return (
    <AppShell title="VC Vault" subtitle={unlocked ? 'Your vault is open.' : 'Earn it before you ask.'}>
      <div className="mx-auto w-full max-w-7xl p-4 md:p-8">
        {!unlocked ? (
          <div className="grid min-h-[70vh] place-items-center text-center">
            <div className="w-full max-w-[520px]">
              <Lock className="mx-auto h-16 w-16 text-[var(--purple)]" />
              <VZNAvatar size="lg" className="mx-auto my-6" />
              <h2 className="text-3xl font-bold">The vault is locked.</h2>
              <p className="mt-3" style={{ color: 'var(--text-muted)' }}>
                Complete your 90-day plan and I&apos;ll open the most valuable door in your startup journey.
              </p>
              <div className="mt-8 space-y-5 text-left">
                <VaultProgress label="Task completion" current={(progress.taskCompletionRate || 0) * 100} target={70} />
                <VaultProgress label="Accountability" current={progress.accountabilityScore || 0} target={60} />
                <VaultProgress label="Traction proof" current={progress.tractionProof ? 1 : 0} target={1} />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold">20 Indian VCs matched to your execution profile.</h2>
                <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>Request intros only after the story is tight.</p>
              </div>
              <button onClick={generateDeck} className="inline-flex items-center gap-2 rounded-xl bg-[var(--purple)] px-5 py-3 font-semibold text-white">
                <Download className="h-4 w-4" /> Generate Pitch Deck
              </button>
            </div>

            <section className="mb-8 rounded-2xl border p-6 print-deck" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
              <div className="print-slide min-h-[260px]">
                <div className="text-sm text-[var(--purple)]">{slides[slide]?.slideNumber}/13 · {slides[slide]?.title}</div>
                <h3 className="mt-4 text-3xl font-bold">{slides[slide]?.headline}</h3>
                <ul className="mt-6 space-y-2" style={{ color: 'var(--text-muted)' }}>
                  {slides[slide]?.bullets?.map((bullet: string) => <li key={bullet}>- {bullet}</li>)}
                </ul>
                <p className="mt-6 italic text-[var(--teal)]">{slides[slide]?.vznNote}</p>
              </div>
              <div className="no-print mt-5 flex gap-2">
                <button onClick={() => setSlide((value) => Math.max(0, value - 1))} className="rounded-lg border px-3 py-2" style={{ borderColor: 'var(--border)' }}>Prev</button>
                <button onClick={() => setSlide((value) => Math.min(slides.length - 1, value + 1))} className="rounded-lg border px-3 py-2" style={{ borderColor: 'var(--border)' }}>Next</button>
                <button onClick={() => window.print()} className="rounded-lg border px-3 py-2" style={{ borderColor: 'var(--border)' }}>Export PDF</button>
              </div>
            </section>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {vcs.map((vc) => (
                <div key={vc[0]} className="rounded-2xl border p-5" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
                  <h3 className="font-bold">{vc[0]}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{vc[1]}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-[var(--purple)] px-2 py-1 text-white">{vc[2]}</span>
                    <span className="rounded-full border px-2 py-1" style={{ borderColor: 'var(--border)' }}>{vc[3]}</span>
                  </div>
                  <ul className="mt-4 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <li>- Stage alignment</li>
                    <li>- India market relevance</li>
                    <li>- Traction-first story</li>
                  </ul>
                  <p className="mt-4 text-sm italic text-[var(--teal)]">VZN match: useful only if your proof is cleaner than your pitch.</p>
                  <button onClick={() => requestIntro(vc)} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--purple)] px-3 py-2 text-sm font-semibold text-white">
                    <Mail className="h-4 w-4" /> Request Intro
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedVc && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[var(--bg-primary)]/80 p-6 backdrop-blur-sm">
          <div className="w-full max-w-[640px] rounded-2xl border p-6" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
            <button onClick={() => setSelectedVc(null)} className="float-right"><X className="h-5 w-5" /></button>
            <h3 className="text-xl font-bold">Intro email to {selectedVc[0]}</h3>
            <input value={email?.subject || ''} onChange={(event) => setEmail((prev: any) => ({ ...prev, subject: event.target.value }))} className="mt-5 w-full rounded-lg border px-3 py-2" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }} />
            <textarea value={email?.body || ''} onChange={(event) => setEmail((prev: any) => ({ ...prev, body: event.target.value }))} rows={10} className="mt-3 w-full rounded-lg border p-3" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }} />
            <button onClick={() => navigator.clipboard?.writeText(`${email?.subject}\n\n${email?.body}`)} className="mt-4 rounded-lg bg-[var(--purple)] px-4 py-2 text-sm font-semibold text-white">
              Copy email
            </button>
          </div>
        </div>
      )}
    </AppShell>
  )
}
