'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send } from 'lucide-react'
import VZNAvatar from '@/components/ui/VZNAvatar'

interface Message {
  id: string
  role: 'user' | 'vzn'
  content: string
  timestamp: Date
}

const QUICK_ACTIONS = [
  '💀 Roast my progress',
  '🎯 What to focus on today?',
  '🔥 Am I going to fail?',
  '📊 Generate my weekly card',
  '🚨 I want to pivot',
  '💡 Analyse a new idea',
  '⚔️ Who\'s my biggest competitor right now?',
  '📈 Am I on track to unlock the vault?',
]

const CARD_TYPES = [
  { label: '📊 Weekly Progress', value: 'weekly-progress' },
  { label: '🧬 Founder DNA', value: 'founder-dna' },
  { label: '🎯 Decision Card', value: 'decision-card' },
  { label: '⚡ Milestone', value: 'milestone' },
  { label: '🔥 Streak Card', value: 'streak-card' },
  { label: '⚔️ Competitor Map', value: 'competitor-map' },
  { label: '💡 Custom Insight', value: 'custom-insight' },
  { label: '📈 Vault Progress', value: 'vault-progress' },
]

export default function VZNChat({
  startupId,
  founderName,
  startupName,
  marketIntelligence,
  currentWeek,
  missionCode,
  missionName,
  dayNumber,
  todayTask,
  accountabilityScore,
  weekCompletionPct,
  streakCount,
  oath,
}: {
  startupId: string
  founderName: string
  startupName: string
  marketIntelligence?: any
  currentWeek?: number
  missionCode?: string
  missionName?: string
  dayNumber?: number
  todayTask?: string
  accountabilityScore?: number
  weekCompletionPct?: number
  streakCount?: number
  oath?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [tab, setTab] = useState<'chat' | 'generate'>('chat')
  const [selectedCard, setSelectedCard] = useState<string>('')
  const [customMessage, setCustomMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat/vzn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          founderName,
          startupName,
          marketIntelligence,
          currentWeek,
          missionCode,
          missionName,
          dayNumber,
          todayTask,
          accountabilityScore,
          weekCompletionPct,
          streakCount,
          oath,
        }),
      })

      const data = await response.json()
      const vznMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'vzn',
        content: data.reply || 'VZN is thinking...',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, vznMessage])
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (action: string) => {
    const text = action.split(' ').slice(1).join(' ')
    handleSendMessage(text)
  }

  const handleGenerateCard = async () => {
    if (!selectedCard) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/ai/generate-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardType: selectedCard,
          weekNumber: currentWeek,
          founderName,
          startupName,
          customMessage,
        }),
      })

      const card = await response.json()
      handleSendMessage(`Generated card: ${card.title}`)
    } catch (error) {
      console.error('Card generation error:', error)
    } finally {
      setIsLoading(false)
      setSelectedCard('')
      setCustomMessage('')
    }
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[var(--purple)] shadow-[0_0_24px_rgba(83,74,183,0.5)] hover:shadow-[0_0_40px_rgba(83,74,183,0.7)] transition-all flex items-center justify-center group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <SVGHexagon />
        <motion.div
          className="absolute inset-[-4px] rounded-full border-2 border-[var(--purple)]/40 animate-pulse"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="fixed bottom-24 right-6 w-[380px] h-[520px] z-50 bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl shadow-[0_0_60px_rgba(83,74,183,0.2)] flex flex-col overflow-hidden md:w-full md:bottom-6 md:right-3 md:max-w-[calc(100vw-32px)]"
          >
            {/* Header */}
            <div className="bg-[var(--bg-tertiary)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <VZNAvatar size="sm" mood="neutral" />
                <div>
                  <div className="font-bold text-white text-sm">VZN</div>
                  <div className="text-[var(--text-muted)] text-xs">
                    {missionCode} {missionName ? ` - ${missionName}` : ''}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-[var(--bg-secondary)] rounded transition"
              >
                <X size={18} className="text-[var(--text-muted)]" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--border)] bg-[var(--bg-secondary)]">
              <button
                onClick={() => setTab('chat')}
                className={`flex-1 px-4 py-2 text-sm font-medium transition ${
                  tab === 'chat'
                    ? 'text-[var(--purple)] border-b-2 border-[var(--purple)]'
                    : 'text-[var(--text-muted)]'
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setTab('generate')}
                className={`flex-1 px-4 py-2 text-sm font-medium transition ${
                  tab === 'generate'
                    ? 'text-[var(--purple)] border-b-2 border-[var(--purple)]'
                    : 'text-[var(--text-muted)]'
                }`}
              >
                Generate Card
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {tab === 'chat' ? (
                <>
                  {messages.length === 0 ? (
                    <div className="space-y-3">
                      <p className="text-[var(--text-muted)] text-sm mb-4">Quick actions:</p>
                      <div className="grid grid-cols-1 gap-2">
                        {QUICK_ACTIONS.map((action, i) => (
                          <button
                            key={i}
                            onClick={() => handleQuickAction(action)}
                            className="px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg hover:border-[var(--purple)] transition text-sm text-left text-white"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[75%] p-3 rounded-2xl ${
                              msg.role === 'user'
                                ? 'bg-[var(--purple)] text-white rounded-tr-none'
                                : 'bg-[var(--bg-tertiary)] border border-[var(--border)] text-white rounded-tl-none'
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex gap-2 items-center">
                          <VZNAvatar size="sm" mood="neutral" />
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce delay-100" />
                            <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce delay-200" />
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-3">
                  <p className="text-[var(--text-muted)] text-sm mb-3">Select card type:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {CARD_TYPES.map((card) => (
                      <button
                        key={card.value}
                        onClick={() => setSelectedCard(card.value)}
                        className={`px-3 py-2 rounded-lg border transition text-sm text-left ${
                          selectedCard === card.value
                            ? 'bg-[var(--purple)] border-[var(--purple)] text-white'
                            : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-white hover:border-[var(--purple)]'
                        }`}
                      >
                        {card.label}
                      </button>
                    ))}
                  </div>
                  {selectedCard && (
                    <textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Add custom message (optional)..."
                      className="w-full p-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-white text-sm resize-none"
                      rows={3}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Input */}
            {tab === 'chat' ? (
              <div className="border-t border-[var(--border)] bg-[var(--bg-secondary)] p-3 flex gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage(input)
                    }
                  }}
                  placeholder="Ask VZN..."
                  className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-white text-sm resize-none focus:border-[var(--purple)] focus:outline-none"
                  rows={1}
                />
                <button
                  onClick={() => handleSendMessage(input)}
                  disabled={isLoading || !input.trim()}
                  className="bg-[var(--purple)] p-2 rounded-lg hover:opacity-90 disabled:opacity-50 transition"
                >
                  <Send size={18} className="text-white" />
                </button>
              </div>
            ) : (
              <div className="border-t border-[var(--border)] bg-[var(--bg-secondary)] p-3">
                <button
                  onClick={handleGenerateCard}
                  disabled={!selectedCard || isLoading}
                  className="w-full bg-[var(--purple)] text-white px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 transition text-sm font-medium"
                >
                  {isLoading ? 'Generating...' : 'Generate Card'}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function SVGHexagon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 2L24.2 8V20L14 26L3.8 20V8L14 2Z"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="14" cy="14" r="3" fill="white" />
    </svg>
  )
}
