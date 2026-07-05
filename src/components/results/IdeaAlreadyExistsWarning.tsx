'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import VZNAvatar from '@/components/ui/VZNAvatar'

export default function IdeaAlreadyExistsWarning({
  startupId,
  topCompetitorName,
  onContinue,
}: {
  startupId: string
  topCompetitorName: string
  onContinue: () => void
}) {
  const [answers, setAnswers] = useState(['', '', ''])
  const [loading, setLoading] = useState(false)

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const handleContinue = async () => {
    setLoading(true)
    try {
      await fetch(`/api/startups/${startupId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitorAwarenessAnswers: answers }),
      })
    } catch (error) {
      console.error('Error saving answers:', error)
    } finally {
      setLoading(false)
      onContinue()
    }
  }

  const allAnswered = answers.every((a) => a.trim().length > 0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-primary)]/95 px-6 text-center backdrop-blur-sm"
    >
      <div className="max-w-[720px]">
        <VZNAvatar size="lg" mood="warning" className="mx-auto" />
        <h2 className="mt-8 text-3xl font-bold text-[var(--red)] md:text-4xl">VZN has to stop you here.</h2>
        <p className="mt-4 text-lg text-[var(--text-muted)]">This idea already exists and is well-funded by {topCompetitorName}. Before you continue, answer these three questions.</p>

        <div className="mt-8 space-y-6 text-left">
          <div>
            <label className="block text-sm font-bold mb-2">
              1. What do you know about this problem that these competitors don't?
            </label>
            <textarea
              value={answers[0]}
              onChange={(e) => handleAnswerChange(0, e.target.value)}
              placeholder="e.g., We've talked to 50 customers who said..."
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-3 text-white text-sm focus:border-[var(--purple)] focus:outline-none resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">
              2. Who specifically will choose you over {topCompetitorName} and why?
            </label>
            <textarea
              value={answers[1]}
              onChange={(e) => handleAnswerChange(1, e.target.value)}
              placeholder="e.g., Founders in India who don't have credit cards, because..."
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-3 text-white text-sm focus:border-[var(--purple)] focus:outline-none resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">
              3. What can you build in 90 days that they can't copy in 6 months?
            </label>
            <textarea
              value={answers[2]}
              onChange={(e) => handleAnswerChange(2, e.target.value)}
              placeholder="e.g., Deep integrations with 10 Indian payment providers..."
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-3 text-white text-sm focus:border-[var(--purple)] focus:outline-none resize-none"
              rows={3}
            />
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={!allAnswered || loading}
          className="mt-8 rounded-xl bg-[var(--purple)] px-8 py-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'I understand the competition. Continue anyway.'}
        </button>
      </div>
    </motion.div>
  )
}
