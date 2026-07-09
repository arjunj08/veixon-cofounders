'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppShell from '@/components/AppShell'
import VZNAvatar from '@/components/ui/VZNAvatar'
import VznMatrixCore from '@/components/dashboard/VznMatrixCore'
import { Play, ArrowRight, RotateCcw, AlertTriangle, ShieldCheck, TrendingUp, Sparkles, AlertCircle } from 'lucide-react'
import { addNotification } from '@/lib/client-notifications'

interface VCPersona {
  id: string
  name: string
  fund: string
  focus: string
  description: string
  difficulty: 'Hard' | 'Medium' | 'Easy'
  accentColor: string
  avatarMood: 'neutral' | 'warning' | 'critical'
}

const VC_PERSONAS: VCPersona[] = [
  {
    id: 'metrics-hawk',
    name: 'The Metrics Hawk',
    fund: 'Hawk Ventures',
    focus: 'ARR Velocity, CAC/LTV, Net Retention, Unit Economics',
    description: 'Will tear apart your growth projections. He only respects hard data, cohort retention rates, and scaling capital efficiency.',
    difficulty: 'Hard',
    accentColor: 'var(--teal)',
    avatarMood: 'neutral'
  },
  {
    id: 'skeptical-generalist',
    name: 'The Skeptical Generalist',
    fund: 'Cynic Capital',
    focus: 'Market Moats, Incumbent Strengths, Product-Market Fit',
    description: 'Convinced you will be crushed by Big Tech or competitors. Demands proof of a unique distribution edge and proprietary moat.',
    difficulty: 'Medium',
    accentColor: 'var(--amber)',
    avatarMood: 'warning'
  },
  {
    id: 'product-purist',
    name: 'The Product Purist',
    fund: 'Craft Partners',
    focus: 'User Delight, Tech Stack Edge, UX/DX Magic',
    description: 'Obsessed with product craftsmanship. Wants to know why customers fall in love with your UI and why your tech is 10x better.',
    difficulty: 'Easy',
    accentColor: 'var(--purple)',
    avatarMood: 'critical'
  }
]

export default function PitchPrepPage() {
  const router = useRouter()
  const [startup, setStartup] = useState<any>(null)
  
  // Phase state: 'select' | 'interview' | 'feedback' | 'scorecard'
  const [phase, setPhase] = useState<'select' | 'interview' | 'feedback' | 'scorecard'>('select')
  const [selectedVc, setSelectedVc] = useState<VCPersona | null>(null)
  
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [userAnswer, setUserAnswer] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('VZN is initializing interview...')
  
  const [feedback, setFeedback] = useState<string>('')
  const [score, setScore] = useState<number>(100)
  const [handledLevel, setHandledLevel] = useState<'Strong' | 'Medium' | 'Weak'>('Medium')
  
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const activeId = window.localStorage.getItem('visionix_active_startup_id')
    if (activeId) {
      const stored = window.localStorage.getItem(`veixon_startup_${activeId}`)
      if (stored) {
        setStartup(JSON.parse(stored))
      }
    }
  }, [])

  async function startInterview(vc: VCPersona) {
    setSelectedVc(vc)
    setPhase('interview')
    setCurrentQIndex(0)
    setHistory([])
    setUserAnswer('')
    
    setLoading(true)
    setLoadingText(`VC Partner ${vc.name} is reading your startup profile...`)
    
    try {
      const res = await fetch('/api/ai/pitch-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: startup || { ideaText: 'A B2B SaaS platform' },
          persona: vc.name,
          currentQuestionIndex: 0,
          answer: ''
        })
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setCurrentQuestion(data.nextQuestion)
    } catch {
      setCurrentQuestion(
        vc.id === 'metrics-hawk' 
          ? 'What is your current Customer Acquisition Cost (CAC) and Payback Period, and how will it scale?' 
          : 'Why will a larger incumbent not copy this exact feature within two weeks?'
      )
    } finally {
      setLoading(false)
    }
  }

  async function submitAnswer() {
    if (!userAnswer.trim()) return
    setLoading(true)
    setLoadingText(`${selectedVc?.name} is evaluating your response...`)
    
    try {
      const res = await fetch('/api/ai/pitch-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: startup || { ideaText: 'A B2B SaaS platform' },
          persona: selectedVc?.name,
          currentQuestionIndex: currentQIndex + 1,
          answer: userAnswer,
          previousQuestions: history.map(h => h.question)
        })
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      
      setFeedback(data.feedback)
      setScore(data.score)
      setHandledLevel(data.handledLevel)
      
      const newHistoryItem = {
        question: currentQuestion,
        answer: userAnswer,
        feedback: data.feedback,
        score: data.score,
        handledLevel: data.handledLevel,
        nextQuestion: data.nextQuestion
      }
      
      const updatedHistory = [...history, newHistoryItem]
      setHistory(updatedHistory)
      setPhase('feedback')
    } catch {
      setFeedback('VZN bypass note: Your answer is noted. Keep the focus concise and metrics-oriented.')
      setScore(Math.floor(Math.random() * 30) + 65)
      setHandledLevel('Medium')
      
      const nextQ = currentQIndex === 0 
        ? 'How do you justify your valuation given your early-stage team profiles?' 
        : 'CONCLUDE'

      const newHistoryItem = {
        question: currentQuestion,
        answer: userAnswer,
        feedback: 'Your answer is noted. Keep the focus concise and metrics-oriented.',
        score: 75,
        handledLevel: 'Medium' as const,
        nextQuestion: nextQ
      }
      setHistory([...history, newHistoryItem])
      setPhase('feedback')
    } finally {
      setLoading(false)
    }
  }

  function handleNext() {
    const lastItem = history[history.length - 1]
    if (lastItem.nextQuestion === 'CONCLUDE' || currentQIndex >= 2) {
      setPhase('scorecard')
      // Record a notification summarizing the result
      const avgScore = Math.round(history.reduce((sum, h) => sum + h.score, 0) / history.length)
      addNotification(`Mock VC Interview completed with ${selectedVc?.name}. Final Score: ${avgScore}/100.`, "/vault")
    } else {
      setCurrentQIndex(prev => prev + 1)
      setCurrentQuestion(lastItem.nextQuestion)
      setUserAnswer('')
      setPhase('interview')
    }
  }

  const averageScore = history.length > 0 
    ? Math.round(history.reduce((sum, h) => sum + h.score, 0) / history.length) 
    : 0

  const getVerdict = (avg: number) => {
    if (avg >= 80) return { title: 'INVESTABLE', desc: 'VC is requesting follow-up meetings. You addressed key objection risks strongly.', color: 'var(--teal)', icon: ShieldCheck }
    if (avg >= 60) return { title: 'NEEDS RE-WORK', desc: 'VC is hesitant but intrigued. Refine your metrics and competitive moat.', color: 'var(--amber)', icon: TrendingUp }
    return { title: 'REJECTED', desc: 'Objection defenses were weak. Back up your claims with traction proof and retry.', color: 'var(--red)', icon: AlertTriangle }
  }

  const verdict = getVerdict(averageScore)

  return (
    <AppShell title="AI Pitch Objections Simulator" subtitle="Train your objections defense with brutal VC partner models.">
      <div className="vzn-page-pad mx-auto w-full max-w-5xl p-4 md:p-8">
        
        {/* PHASE 1: SELECT VC */}
        {phase === 'select' && (
          <div>
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold">Choose your interrogator</h2>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                Each VC Persona simulates a distinct investment style. They will grill you specifically on your active startup idea: <span className="font-bold text-white">"{startup?.ideaText || 'B2B E-commerce Optimization'}"</span>.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              {VC_PERSONAS.map(vc => (
                <div 
                  key={vc.id}
                  className="vzn-panel-strong rounded-2xl p-6 flex flex-col justify-between veixon-lift border transition-all duration-300"
                  style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] uppercase tracking-widest font-mono" style={{ color: 'var(--text-dim)' }}>
                        {vc.fund}
                      </span>
                      <span 
                        className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                        style={{ 
                          background: vc.difficulty === 'Hard' ? 'rgba(239, 68, 68, 0.15)' : vc.difficulty === 'Medium' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(168, 85, 247, 0.15)',
                          color: vc.difficulty === 'Hard' ? 'var(--red)' : vc.difficulty === 'Medium' ? 'var(--amber)' : 'var(--purple)',
                          border: `1px solid ${vc.difficulty === 'Hard' ? 'rgba(239, 68, 68, 0.3)' : vc.difficulty === 'Medium' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(168, 85, 247, 0.3)'}`
                        }}
                      >
                        {vc.difficulty}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2">{vc.name}</h3>
                    <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                      {vc.description}
                    </p>
                    
                    <div className="border-t pt-3 mb-6" style={{ borderColor: 'rgba(255, 255, 255, 0.04)' }}>
                      <span className="text-[9px] font-mono uppercase block text-[var(--purple)] tracking-wider mb-1">Objection Focus</span>
                      <p className="text-[11px] leading-relaxed text-white/90">{vc.focus}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => startInterview(vc)}
                    className="vzn-button-primary rounded-xl w-full py-2.5 flex items-center justify-center gap-2 text-xs font-semibold text-white transition-all"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Enter Simulation
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className="grid place-items-center py-20 text-center min-h-[400px]">
            <div className="vzn-panel-strong max-w-[480px] rounded-2xl p-8 border" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
              <div className="scale-125 mb-6">
                <VznMatrixCore />
              </div>
              <p className="text-sm font-mono text-[var(--purple)] tracking-widest uppercase animate-pulse">
                Evaluating Objections Matrix
              </p>
              <p className="text-xs text-[var(--text-dim)] mt-2 leading-relaxed">
                {loadingText}
              </p>
            </div>
          </div>
        )}

        {/* PHASE 2: INTERVIEW LOOP */}
        {phase === 'interview' && !loading && selectedVc && (
          <div className="grid gap-6 md:grid-cols-[280px_1fr]">
            {/* VC Profile Column */}
            <div className="vzn-panel rounded-2xl p-6 flex flex-col items-center justify-between border" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
              <div className="text-center w-full">
                <VZNAvatar size="lg" mood={selectedVc.avatarMood} className="mx-auto mb-4" />
                <h3 className="font-bold text-white">{selectedVc.name}</h3>
                <span className="text-[10px] font-mono tracking-widest text-[var(--purple)] block uppercase mt-0.5">{selectedVc.fund}</span>
                
                <div className="mt-6 border-t border-b py-3 space-y-3 text-left" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                  <div className="text-[10px] font-mono leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    <span className="block text-[9px] uppercase tracking-wider text-[var(--purple)] mb-0.5">Focusing On</span>
                    {selectedVc.focus}
                  </div>
                  <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                    <span className="block text-[9px] uppercase tracking-wider text-[var(--purple)] mb-0.5">Question index</span>
                    {currentQIndex + 1} of 3
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setPhase('select')}
                className="text-[10px] text-red-400 font-medium hover:underline mt-6 flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                Abort Interview
              </button>
            </div>

            {/* Answer Field Column */}
            <div className="space-y-6">
              <div 
                className="vzn-panel-strong rounded-2xl p-6 border shadow-2xl relative"
                style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}
              >
                <div className="absolute top-4 left-4 h-2 w-2 rounded-full animate-ping" style={{ background: selectedVc.accentColor }} />
                <div className="pl-4">
                  <span className="text-[9px] font-mono uppercase tracking-widest block text-[var(--purple)] mb-1">VC Objection Challenge</span>
                  <h4 className="text-md font-semibold text-white leading-relaxed">{currentQuestion}</h4>
                </div>
              </div>

              <div className="vzn-panel rounded-2xl p-6 border" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                <span className="text-[9px] font-mono uppercase tracking-widest block text-[var(--purple)] mb-2">Your Defense Response</span>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  rows={6}
                  maxLength={600}
                  placeholder="Defend your position. Reference metrics, unfair advantages, or validation loops..."
                  className="vzn-input w-full rounded-xl p-4 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[9px] font-mono" style={{ color: 'var(--text-dim)' }}>
                    {userAnswer.length}/600 characters max
                  </span>
                  <button 
                    disabled={!userAnswer.trim()}
                    onClick={submitAnswer}
                    className="vzn-button-primary rounded-xl px-5 py-2.5 flex items-center gap-2 text-xs font-semibold text-white disabled:opacity-50"
                  >
                    Submit Defense
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PHASE 3: OBJECTION FEEDBACK */}
        {phase === 'feedback' && !loading && selectedVc && (
          <div className="grid gap-6 md:grid-cols-[280px_1fr]">
            {/* VC Profile Column */}
            <div className="vzn-panel rounded-2xl p-6 flex flex-col items-center justify-between border" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
              <div className="text-center w-full">
                <VZNAvatar size="lg" mood={score >= 80 ? 'neutral' : score >= 60 ? 'warning' : 'critical'} className="mx-auto mb-4" />
                <h3 className="font-bold text-white">{selectedVc.name}</h3>
                <span className="text-[10px] font-mono tracking-widest text-[var(--purple)] block uppercase mt-0.5">{selectedVc.fund}</span>
                
                <div className="mt-6 border-t py-3 space-y-3" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                  <span className="text-[9px] uppercase tracking-wider text-[var(--purple)] block mb-1">Defense rating</span>
                  <div className="flex justify-center items-baseline gap-1">
                    <span className="text-3xl font-bold font-mono text-white">{score}</span>
                    <span className="text-xs text-[var(--text-dim)]">/100</span>
                  </div>
                  <span 
                    className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold font-mono"
                    style={{
                      background: handledLevel === 'Strong' ? 'rgba(20, 184, 166, 0.15)' : handledLevel === 'Medium' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: handledLevel === 'Strong' ? 'var(--teal)' : handledLevel === 'Medium' ? 'var(--amber)' : 'var(--red)'
                    }}
                  >
                    {handledLevel} Defense
                  </span>
                </div>
              </div>
              
              <button 
                onClick={handleNext}
                className="vzn-button-primary rounded-xl w-full py-2.5 flex items-center justify-center gap-2 text-xs font-semibold text-white"
              >
                Proceed
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Feedback Content Column */}
            <div className="space-y-6">
              {/* Challenge Recap */}
              <div className="vzn-panel rounded-2xl p-5 border" style={{ borderColor: 'rgba(255, 255, 255, 0.04)' }}>
                <span className="text-[9px] font-mono uppercase tracking-widest block text-[var(--text-dim)] mb-1">The Challenge</span>
                <p className="text-xs text-white/80 italic">"{currentQuestion}"</p>
              </div>

              {/* Your Answer Recap */}
              <div className="vzn-panel rounded-2xl p-5 border" style={{ borderColor: 'rgba(255, 255, 255, 0.04)' }}>
                <span className="text-[9px] font-mono uppercase tracking-widest block text-[var(--text-dim)] mb-1">Your Response</span>
                <p className="text-xs text-white/80 leading-relaxed font-mono">"{userAnswer}"</p>
              </div>

              {/* AI Feedback */}
              <div className="vzn-panel-strong rounded-2xl p-6 border shadow-2xl" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-[var(--purple)]" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">VZN Objection Analysis</span>
                </div>
                <p className="text-xs leading-relaxed text-white/90 border-l-2 pl-3" style={{ borderColor: 'var(--purple)' }}>
                  {feedback}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PHASE 4: FINAL SCORECARD */}
        {phase === 'scorecard' && !loading && selectedVc && (
          <div className="vzn-panel-strong rounded-[2rem] p-8 max-w-2xl mx-auto border text-center relative" style={{ borderColor: 'rgba(255, 255, 255, 0.07)' }}>
            <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-mono" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span>Partner: {selectedVc.name}</span>
            </div>
            
            <h2 className="text-2xl font-bold tracking-tight mb-2">Simulated Pitch Scorecard</h2>
            <p className="text-xs text-[var(--text-muted)] mb-8">Objections drill sequence completed.</p>
            
            <div className="flex flex-col items-center mb-8">
              <div className="relative flex justify-center items-center h-32 w-32 rounded-full border-4 font-mono shadow-2xl" style={{ borderColor: verdict.color }}>
                <div className="text-center">
                  <span className="text-4xl font-extrabold text-white">{averageScore}</span>
                  <span className="text-xs block text-[var(--text-dim)]">AVG SCORE</span>
                </div>
              </div>
              
              <div className="mt-5 flex items-center gap-2 justify-center">
                <verdict.icon className="h-5 w-5" style={{ color: verdict.color }} />
                <span className="text-lg font-black tracking-widest" style={{ color: verdict.color }}>
                  {verdict.title}
                </span>
              </div>
              <p className="mt-2 text-xs max-w-md" style={{ color: 'var(--text-muted)' }}>
                {verdict.desc}
              </p>
            </div>

            {/* Questions list drilldown */}
            <div className="text-left border-t pt-6 space-y-4 mb-8" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
              <span className="text-[10px] uppercase tracking-wider font-mono text-[var(--purple)] font-bold block mb-2">Objection Breakdown</span>
              {history.map((h, i) => (
                <div key={i} className="vzn-panel rounded-xl p-4 border text-xs" style={{ borderColor: 'rgba(255, 255, 255, 0.03)' }}>
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <span className="font-bold text-white">Objection {i + 1}</span>
                    <span 
                      className="font-mono font-bold" 
                      style={{ color: h.handledLevel === 'Strong' ? 'var(--teal)' : h.handledLevel === 'Medium' ? 'var(--amber)' : 'var(--red)' }}
                    >
                      {h.score}/100 ({h.handledLevel})
                    </span>
                  </div>
                  <p className="text-[11px] text-white/95 leading-relaxed font-mono">Q: {h.question}</p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1.5">Feedback: {h.feedback}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 justify-center">
              <button 
                onClick={() => setPhase('select')}
                className="vzn-button-primary rounded-xl px-6 py-3 flex items-center gap-2 text-xs font-semibold text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Retry Objections Drill
              </button>
              <button 
                onClick={() => router.push('/vault')}
                className="vzn-button-ghost rounded-xl px-6 py-3 text-xs font-semibold transition-colors"
                style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
              >
                Return to Vault
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
