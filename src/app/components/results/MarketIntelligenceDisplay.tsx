'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react'
import VZNAvatar from '@/components/ui/VZNAvatar'
import type { MarketIntelligence } from '@/lib/types'

export default function MarketIntelligenceDisplay({ data }: { data: MarketIntelligence }) {
  if (!data || !data.ideaOriginality || !data.marketStatus || !data.vcSentiment || !data.graveyardWarning || !data.whitespace) {
    return (
      <div className="rounded-2xl border p-6 text-center text-sm text-[var(--text-muted)]" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
        <AlertCircle className="mx-auto mb-2 h-6 w-6 text-[var(--amber)]" />
        Market intelligence data is currently being analyzed or is unavailable. Please refresh shortly.
      </div>
    )
  }
  const getOriginalityColor = (score: number) => {
    if (score >= 9) return 'var(--teal)'
    if (score >= 7) return 'var(--purple)'
    if (score >= 5) return 'var(--amber)'
    if (score >= 3) return 'var(--orange)'
    return 'var(--red)'
  }

  const getOriginalityLabel = (score: number) => {
    if (score >= 9) return 'FIRST MOVER'
    if (score >= 7) return 'DIFFERENTIATED'
    if (score >= 5) return 'CROWDED BUT WINNABLE'
    if (score >= 3) return 'HEAVILY CONTESTED'
    return 'ALREADY BUILT'
  }

  const timingStages = ['Too Early', 'Right Time', 'Slightly Late', 'Too Late']
  const stageIndex = timingStages.findIndex((s) => s.toLowerCase().includes((data?.marketStatus?.timing || '').toLowerCase().split(' ')[0].toLowerCase()))

  const heatMap: Record<string, { color: string; label: string; emoji: string }> = {
    hot: { color: 'var(--red)', label: 'HOT', emoji: '🔥' },
    warm: { color: 'var(--orange)', label: 'WARM', emoji: '' },
    cooling: { color: 'var(--amber)', label: 'COOLING', emoji: '' },
    cold: { color: 'var(--blue)', label: 'COLD', emoji: '❄️' },
  }

  const vcState = heatMap[(data?.vcSentiment?.currentInterest || '').toLowerCase()] || heatMap.cold

  return (
    <div className="space-y-8">
      {/* Idea Originality */}
      <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border p-6" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[var(--purple)]">Market Intelligence</div>
            <h2 className="mt-1 text-2xl font-bold">Idea Originality</h2>
          </div>
          <VZNAvatar size="sm" />
        </div>

        <div className="mb-8 flex items-end gap-6">
          <div>
            <div className="text-6xl font-bold" style={{ color: getOriginalityColor(data.ideaOriginality.score) }}>
              {data.ideaOriginality.score}
            </div>
            <div className="mt-2 text-sm text-[var(--text-muted)]">/10</div>
          </div>
          <div className="mb-1">
            <div
              className="inline-block rounded-full px-4 py-2 font-bold"
              style={{ background: `${getOriginalityColor(data.ideaOriginality.score)}20`, color: getOriginalityColor(data.ideaOriginality.score), border: `2px solid ${getOriginalityColor(data.ideaOriginality.score)}` }}
            >
              {getOriginalityLabel(data.ideaOriginality.score)}
            </div>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-[var(--text-muted)]">{data.ideaOriginality.explanation}</p>
      </motion.section>

      {/* Graveyard Warning */}
      {data.graveyardWarning.hasDeadStartups && (
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border-2 p-6" style={{ background: 'var(--card-bg)', borderColor: 'var(--red)' }}>
          <div className="mb-4 text-2xl font-bold text-[var(--red)]">⚰️ The Graveyard</div>
          <p className="mb-6 font-medium text-white">{data.graveyardWarning.mostRelevantDeathStory}</p>
          <p className="text-sm text-[var(--amber)]">
            <span className="font-bold">Pattern across failures:</span> {data.graveyardWarning.patternAcrossDeaths}
          </p>
        </motion.section>
      )}

      {/* Direct Competitors */}
      {data.directCompetitors && data.directCompetitors.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h3 className="text-xl font-bold">Direct Competitors</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {data.directCompetitors.map((competitor, i) => (
              <div key={i} className="rounded-xl border p-4" style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}>
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <div className="font-bold">{competitor.name}</div>
                    <div className="text-xs text-[var(--text-muted)]">{competitor.foundedYear || 'Unknown year'} · {competitor.funding || 'Unknown funding'}</div>
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium" style={{ background: competitor.status === 'active' ? 'var(--teal)20' : 'var(--red)20', color: competitor.status === 'active' ? 'var(--teal)' : 'var(--red)' }}>
                    <span className="h-2 w-2 rounded-full" style={{ background: competitor.status === 'active' ? 'var(--teal)' : 'var(--red)' }} />
                    {competitor.status === 'active' ? 'Active competitor' : `Shut down`}
                  </div>
                </div>
                <p className="mb-3 text-sm">{competitor.whyTheyMatter}</p>
                <div className="space-y-2 text-xs">
                  {competitor.theirWeakness && <p className="text-[var(--teal)] italic">Their weakness: {competitor.theirWeakness}</p>}
                  {competitor.shutdownReason && <p className="text-[var(--red)] italic">Died because: {competitor.shutdownReason}</p>}
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Market Timing */}
      <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border p-6" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
        <h3 className="mb-6 text-xl font-bold">Market Timing</h3>
        <div className="mb-6 flex justify-between gap-2">
          {timingStages.map((stage, i) => (
            <div key={i} className="flex-1 text-center">
              <div
                className="mb-2 rounded-lg px-3 py-2 text-sm font-bold"
                style={{
                  background: stageIndex === i ? `${getOriginalityColor(data.ideaOriginality.score)}20` : 'var(--border)',
                  color: stageIndex === i ? getOriginalityColor(data.ideaOriginality.score) : 'var(--text-muted)',
                  borderColor: stageIndex === i ? getOriginalityColor(data.ideaOriginality.score) : 'transparent',
                  border: stageIndex === i ? `2px solid ${getOriginalityColor(data.ideaOriginality.score)}` : 'none',
                }}
              >
                {stage}
              </div>
            </div>
          ))}
        </div>
        <p className="mb-4 text-sm text-[var(--text-muted)]">{data.marketStatus.timingExplanation}</p>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--amber)]">🇮🇳 India-Specific Dynamics</div>
          <p className="text-sm">{data.marketStatus.indianMarketSpecific}</p>
        </div>
      </motion.section>

      {/* Whitespace */}
      {data.whitespace && (
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border-2 p-6" style={{ background: 'var(--card-bg)', borderColor: data.whitespace.exists ? 'var(--teal)' : 'var(--red)' }}>
          <div className="mb-4 flex items-center gap-2">
            {data.whitespace.exists ? (
              <>
                <CheckCircle2 size={24} className="text-[var(--teal)]" />
                <h3 className="text-xl font-bold text-[var(--teal)]">✓ Real Whitespace Exists</h3>
              </>
            ) : (
              <>
                <AlertCircle size={24} className="text-[var(--red)]" />
                <h3 className="text-xl font-bold text-[var(--red)]">✗ No Clear Whitespace Found</h3>
              </>
            )}
          </div>
          <p className="mb-3 text-sm">{data.whitespace.description}</p>
          <p className="text-xs text-[var(--text-muted)]">{data.whitespace.why}</p>
        </motion.section>
      )}

      {/* VC Sentiment */}
      <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border p-6" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
        <h3 className="mb-6 text-xl font-bold">VC Sentiment</h3>
        <div className="mb-6 flex justify-around gap-2">
          {['hot', 'warm', 'cooling', 'cold'].map((level) => {
            const state = heatMap[level]
            const isActive = data.vcSentiment.currentInterest.toLowerCase() === level
            return (
              <div key={level} className="text-center">
                <div
                  className="mb-2 inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-bold"
                  style={{
                    background: isActive ? `${state.color}30` : 'var(--border)',
                    color: isActive ? state.color : 'var(--text-muted)',
                  }}
                >
                  {state.emoji} {state.label}
                </div>
              </div>
            )
          })}
        </div>
        <p className="mb-3 text-sm text-[var(--text-muted)]">{data.vcSentiment.explanation}</p>
        <p className="text-xs italic text-[var(--text-muted)]">{data.vcSentiment.recentFundingSignals}</p>
      </motion.section>

      {/* VZN Verdict */}
      <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border p-6" style={{ background: 'var(--card-bg)', borderColor: 'var(--purple)', boxShadow: '0 0 60px var(--card-glow)' }}>
        <div className="mb-4 flex items-start gap-3">
          <VZNAvatar size="sm" mood="neutral" />
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[var(--purple)]">Market Verdict</div>
            <h3 className="text-xl font-bold">VZN's Assessment</h3>
          </div>
        </div>
        <p className="mb-6 leading-relaxed">{data.vznVerdict}</p>
        <div className="space-y-3">
          <div className="rounded-lg border border-[var(--red)] bg-[var(--red)]/5 p-3">
            <div className="mb-1 text-xs font-bold text-[var(--red)]">BIGGEST THREAT</div>
            <p className="text-sm">{data.biggestThreat}</p>
          </div>
          <div className="rounded-lg border border-[var(--teal)] bg-[var(--teal)]/5 p-3">
            <div className="mb-1 text-xs font-bold text-[var(--teal)]">UNFAIR ADVANTAGE NEEDED</div>
            <p className="text-sm">{data.unfairAdvantage}</p>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
