'use client'

import { useState, useEffect } from 'react'
import AppShell from '@/components/AppShell'
import VZNAvatar from '@/components/ui/VZNAvatar'
import { Plus, Trash2, Map, ShieldAlert, Zap, Compass, Info, HelpCircle } from 'lucide-react'
import { addNotification } from '@/lib/client-notifications'

interface Competitor {
  id: string
  name: string
  category: 'direct' | 'indirect' | 'future'
  depth: number // 1 to 10 (X-axis)
  traction: number // 1 to 10 (Y-axis)
  strength: string
  weakness: string
  threatLevel: 'High' | 'Medium' | 'Low'
  notes?: string
}

const DEFAULT_COMPETITORS: Competitor[] = [
  {
    id: '1',
    name: 'Legacy Spreadsheets',
    category: 'indirect',
    depth: 2,
    traction: 9,
    strength: 'Free, universally adopted, complete user control.',
    weakness: 'No automation, error-prone, static, slow to update.',
    threatLevel: 'High',
    notes: 'The default enemy. Must prove our workflow saves 10 hours a week.'
  },
  {
    id: '2',
    name: 'Enterprise ERP Add-ons',
    category: 'direct',
    depth: 8,
    traction: 7,
    strength: 'Deeply integrated into corporate billing systems.',
    weakness: 'Extremely expensive, requires months to deploy, poor UX.',
    threatLevel: 'Medium',
    notes: 'We beat them on speed, price, and ease-of-use.'
  },
  {
    id: '3',
    name: 'Single-Point Forecasters',
    category: 'future',
    depth: 5,
    traction: 4,
    strength: 'Focussed analytics tools.',
    weakness: 'Lack execution pipelines or direct ERP write-backs.',
    threatLevel: 'Low',
    notes: 'Need to monitor their funding rounds and API updates.'
  }
]

export default function CompetitorRadarPage() {
  const [startupId, setStartupId] = useState<string>('guest')
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  
  // Moat / Unfair Advantage text
  const [moat, setMoat] = useState('')
  const [moatSaved, setMoatSaved] = useState(false)
  
  // Selected competitor for details drawer
  const [selectedComp, setSelectedComp] = useState<Competitor | null>(null)
  
  // Add competitor form state
  const [newName, setNewName] = useState('')
  const [newCategory, setNewCategory] = useState<'direct' | 'indirect' | 'future'>('direct')
  const [newDepth, setNewDepth] = useState(5)
  const [newTraction, setNewTraction] = useState(5)
  const [newStrength, setNewStrength] = useState('')
  const [newWeakness, setNewWeakness] = useState('')
  const [newThreat, setNewThreat] = useState<'High' | 'Medium' | 'Low'>('Medium')
  const [newNotes, setNewNotes] = useState('')

  // Load from local storage
  useEffect(() => {
    if (typeof window === 'undefined') return
    const activeId = window.localStorage.getItem('visionix_active_startup_id') || 'guest'
    setStartupId(activeId)
    
    // Load competitors
    const storedComps = window.localStorage.getItem(`veixon_competitors_${activeId}`)
    if (storedComps) {
      setCompetitors(JSON.parse(storedComps))
    } else {
      setCompetitors(DEFAULT_COMPETITORS)
      window.localStorage.setItem(`veixon_competitors_${activeId}`, JSON.stringify(DEFAULT_COMPETITORS))
    }
    
    // Load moat
    const storedMoat = window.localStorage.getItem(`veixon_moat_${activeId}`)
    if (storedMoat) {
      setMoat(storedMoat)
      setMoatSaved(true)
    }
  }, [])

  // Save competitors state helper
  const saveCompetitorsList = (updated: Competitor[]) => {
    setCompetitors(updated)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(`veixon_competitors_${startupId}`, JSON.stringify(updated))
    }
  }

  // Add Competitor
  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    const newComp: Competitor = {
      id: Math.random().toString(36).substring(2, 9),
      name: newName,
      category: newCategory,
      depth: newDepth,
      traction: newTraction,
      strength: newStrength,
      weakness: newWeakness,
      threatLevel: newThreat,
      notes: newNotes
    }

    const updated = [...competitors, newComp]
    saveCompetitorsList(updated)
    
    // Reset Form
    setNewName('')
    setNewStrength('')
    setNewWeakness('')
    setNewNotes('')
    setNewDepth(5)
    setNewTraction(5)
    
    addNotification(`Added competitor "${newName}" to your Market Radar map.`, "/dashboard/competitors")
  }

  // Delete Competitor
  const handleDeleteCompetitor = (id: string, name: string) => {
    const updated = competitors.filter(c => c.id !== id)
    saveCompetitorsList(updated)
    if (selectedComp?.id === id) {
      setSelectedComp(null)
    }
    addNotification(`Removed competitor "${name}" from Market Radar.`, "/dashboard/competitors")
  }

  // Save Moat
  const handleSaveMoat = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(`veixon_moat_${startupId}`, moat)
    }
    setMoatSaved(true)
    addNotification("Startup competitive moat / unfair advantage updated.", "/dashboard/competitors")
  }

  return (
    <AppShell title="Competitor Radar" subtitle="Plot threat vectors, mapping points, and defensive moats.">
      <div className="vzn-page-pad mx-auto w-full max-w-7xl p-4 md:p-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        
        {/* LEFT COLUMN: RADAR MAP & DETAILS */}
        <div className="space-y-8">
          
          {/* 3D RADAR CANVAS PLOT */}
          <div 
            className="vzn-panel-strong rounded-3xl p-6 border relative overflow-hidden flex flex-col items-center"
            style={{ 
              borderColor: 'rgba(255, 255, 255, 0.06)',
              background: 'radial-gradient(circle at center, rgba(30, 20, 50, 0.4) 0%, rgba(13, 12, 30, 0.95) 100%)'
            }}
          >
            <div className="w-full flex items-center justify-between mb-4 z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--purple)] flex items-center gap-1.5">
                <Compass className="h-4 w-4 animate-spin-slow" />
                Live Competitor Radar Map
              </span>
              <div className="flex gap-4 text-[10px] font-mono" style={{ color: 'var(--text-dim)' }}>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-400" /> Direct</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" /> Indirect</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-purple-400" /> Future</span>
              </div>
            </div>

            {/* RADAR BOX */}
            <div className="relative w-full max-w-[500px] aspect-square border border-white/5 rounded-2xl bg-black/40 overflow-hidden flex items-center justify-center">
              
              {/* Radar Circles */}
              <div className="absolute inset-[15%] border border-white/5 rounded-full pointer-events-none" />
              <div className="absolute inset-[30%] border border-white/5 rounded-full pointer-events-none" />
              <div className="absolute inset-[45%] border border-white/5 rounded-full pointer-events-none" />
              
              {/* Grid Axis Lines */}
              <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/5 pointer-events-none" />
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/5 pointer-events-none" />

              {/* Axis Labels */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[8px] font-mono uppercase tracking-widest text-teal-400 flex items-center gap-0.5">
                <Zap className="h-2 w-2" /> High Traction
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-mono uppercase tracking-widest text-[var(--text-dim)]">
                Low Traction
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] font-mono uppercase tracking-widest text-purple-400">
                Platform Solution
              </div>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[8px] font-mono uppercase tracking-widest text-[var(--text-dim)]">
                Niche Focus
              </div>

              {/* Quadrant Labels */}
              <div className="absolute top-4 left-4 text-[7px] font-mono text-white/20 uppercase">Aggressive Entrants</div>
              <div className="absolute top-4 right-4 text-[7px] font-mono text-teal-400/30 uppercase">Market Leaders</div>
              <div className="absolute bottom-4 left-4 text-[7px] font-mono text-white/10 uppercase">Niche Specialists</div>
              <div className="absolute bottom-4 right-4 text-[7px] font-mono text-purple-400/20 uppercase">Platform Aspirants</div>

              {/* Plotted Competitor Bubbles */}
              {competitors.map(c => {
                // Map rating 1-10 to percentage 5% to 95%
                const left = 5 + (c.depth - 1) * 10
                // Y-axis: Top is High traction (10), Bottom is Low traction (1)
                // So Y percentage = 100 - (5 + (traction-1)*10)
                const top = 100 - (5 + (c.traction - 1) * 10)
                
                const getBubbleBg = (cat: string) => {
                  if (cat === 'direct') return 'rgba(239, 68, 68, 0.4)'
                  if (cat === 'indirect') return 'rgba(245, 158, 11, 0.4)'
                  return 'rgba(168, 85, 247, 0.4)'
                }
                
                const getBubbleBorder = (cat: string) => {
                  if (cat === 'direct') return 'var(--red)'
                  if (cat === 'indirect') return 'var(--amber)'
                  return 'var(--purple)'
                }

                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedComp(c)}
                    className="absolute h-8 w-8 rounded-full border flex items-center justify-center text-[10px] font-bold text-white transition-all transform hover:scale-125 hover:shadow-2xl z-20 cursor-pointer shadow-lg active:scale-95"
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                      transform: `translate(-50%, -50%) ${selectedComp?.id === c.id ? 'scale(1.2)' : ''}`,
                      background: getBubbleBg(c.category),
                      borderColor: getBubbleBorder(c.category),
                      boxShadow: selectedComp?.id === c.id ? `0 0 15px ${getBubbleBorder(c.category)}` : 'none'
                    }}
                    title={c.name}
                  >
                    {c.name.substring(0, 2).toUpperCase()}
                  </button>
                )
              })}

              {/* Founder Flag (The Center point of focus) */}
              <div 
                className="absolute h-4 w-4 rounded-full border border-teal-400 bg-teal-500/80 flex items-center justify-center text-[7px] font-black text-black z-30"
                style={{
                  left: '60%', // Founder is placed slightly right/up as starting point
                  top: '40%',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 10px var(--teal)'
                }}
                title="Your Position"
              >
                YOU
              </div>
            </div>
            
            <p className="mt-4 text-[10px] text-[var(--text-dim)] text-center max-w-md">
              Click any bubble on the radar screen to pull up competitive intelligence notes, strengths, and threat levels.
            </p>
          </div>

          {/* COMPETITOR DETAILS DRAWER/CARD */}
          {selectedComp ? (
            <div 
              className="vzn-panel rounded-2xl p-6 border shadow-2xl animate-in slide-in-from-bottom-4 duration-300 relative"
              style={{ borderColor: 'rgba(168, 85, 247, 0.2)', background: 'rgba(13, 12, 30, 0.95)' }}
            >
              <button 
                onClick={() => setSelectedComp(null)}
                className="absolute top-4 right-4 text-xs hover:underline text-[var(--text-dim)]"
              >
                Close Details
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                <span className="rounded-full px-2.5 py-0.5 text-[9px] font-bold font-mono uppercase" 
                  style={{ 
                    background: selectedComp.category === 'direct' ? 'rgba(239,68,68,0.1)' : selectedComp.category === 'indirect' ? 'rgba(245,158,11,0.1)' : 'rgba(168,85,247,0.1)',
                    color: selectedComp.category === 'direct' ? 'var(--red)' : selectedComp.category === 'indirect' ? 'var(--amber)' : 'var(--purple)'
                  }}
                >
                  {selectedComp.category} threat
                </span>
                <span className="rounded-full px-2.5 py-0.5 text-[9px] font-bold font-mono uppercase bg-white/5 border border-white/10 text-white">
                  Threat: {selectedComp.threatLevel}
                </span>
              </div>
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">{selectedComp.name}</h3>
                <button 
                  onClick={() => handleDeleteCompetitor(selectedComp.id, selectedComp.name)}
                  className="p-1.5 hover:bg-white/5 rounded-lg text-red-400"
                  title="Remove competitor"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 mb-4">
                <div className="bg-white/2 rounded-xl p-3 border border-white/5">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--purple)] block mb-1">Core Strength</span>
                  <p className="text-xs text-white/90 leading-relaxed">{selectedComp.strength || 'N/A'}</p>
                </div>
                <div className="bg-white/2 rounded-xl p-3 border border-white/5">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-red-400 block mb-1">Vulnerability / Weakness</span>
                  <p className="text-xs text-white/90 leading-relaxed">{selectedComp.weakness || 'N/A'}</p>
                </div>
              </div>

              {selectedComp.notes && (
                <div className="border-t pt-3" style={{ borderColor: 'rgba(255, 255, 255, 0.04)' }}>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--purple)] block mb-1">Intelligence notes</span>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed font-mono italic">"{selectedComp.notes}"</p>
                </div>
              )}
            </div>
          ) : (
            <div className="vzn-panel rounded-2xl p-6 text-center border border-dashed border-white/10" style={{ color: 'var(--text-dim)' }}>
              <div className="flex justify-center mb-2"><Info className="h-6 w-6 text-[var(--purple)]" /></div>
              <p className="text-xs">No competitor selected. Plot your coordinates above or add a new competitor card on the right.</p>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: ADD COMPETITOR & DEFENSIVE MOAT */}
        <div className="space-y-8">
          
          {/* DEFENSIVE MOAT BUILDER */}
          <div className="vzn-panel-strong rounded-2xl p-6 border" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--purple)] block mb-3">
              Defensive Moat Vector
            </span>
            <p className="text-[10px] text-[var(--text-muted)] leading-relaxed mb-4">
              What is your structural edge? Why can't a competitor with 10x funding copy your product model?
            </p>
            <textarea
              value={moat}
              onChange={(e) => {
                setMoat(e.target.value)
                setMoatSaved(false)
              }}
              rows={4}
              placeholder="E.g., Proprietary data edge (accessing custom ERP pipelines), high integration lock-in, exclusive supply partnerships..."
              className="vzn-input w-full rounded-xl p-3 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button
              onClick={handleSaveMoat}
              disabled={moatSaved || !moat.trim()}
              className="vzn-button-primary rounded-xl w-full py-2 mt-3 text-xs font-semibold text-white disabled:opacity-50"
            >
              {moatSaved ? 'Moat Locked' : 'Lock Moat Position'}
            </button>
          </div>

          {/* ADD COMPETITOR FORM */}
          <div className="vzn-panel rounded-2xl p-6 border" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--purple)] block mb-4">
              Plot Competitor Card
            </span>
            <form onSubmit={handleAddCompetitor} className="space-y-4 text-left">
              <div>
                <label className="text-[10px] font-mono text-[var(--text-dim)] uppercase block mb-1">Competitor Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="E.g. Stripe, Salesforce"
                  className="vzn-input w-full rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-[var(--text-dim)] uppercase block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="vzn-input w-full rounded-xl px-2 py-2 text-xs"
                    style={{ background: '#141418' }}
                  >
                    <option value="direct">Direct</option>
                    <option value="indirect">Indirect</option>
                    <option value="future">Future</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-[var(--text-dim)] uppercase block mb-1">Threat Level</label>
                  <select
                    value={newThreat}
                    onChange={(e) => setNewThreat(e.target.value as any)}
                    className="vzn-input w-full rounded-xl px-2 py-2 text-xs"
                    style={{ background: '#141418' }}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              {/* Slider inputs for coordinates */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-[var(--text-dim)] mb-1">
                    <span>PRODUCT DEPTH: {newDepth}</span>
                    <span className="text-[8px] uppercase tracking-wider text-[var(--purple)]">niche ➔ platform</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newDepth}
                    onChange={(e) => setNewDepth(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-[var(--text-dim)] mb-1">
                    <span>TRACTION / SPEED: {newTraction}</span>
                    <span className="text-[8px] uppercase tracking-wider text-teal-400">slow ➔ leader</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newTraction}
                    onChange={(e) => setNewTraction(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-[var(--text-dim)] uppercase block mb-1">Competitor Strength</label>
                <input
                  type="text"
                  value={newStrength}
                  onChange={(e) => setNewStrength(e.target.value)}
                  placeholder="What is their primary advantage?"
                  className="vzn-input w-full rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-[var(--text-dim)] uppercase block mb-1">Weakness / Vulnerability</label>
                <input
                  type="text"
                  value={newWeakness}
                  onChange={(e) => setNewWeakness(e.target.value)}
                  placeholder="Where do they fail/lack speed?"
                  className="vzn-input w-full rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-[var(--text-dim)] uppercase block mb-1">Intelligence notes (Private)</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={2}
                  placeholder="Private VZN co-founder memo..."
                  className="vzn-input w-full rounded-xl p-3 text-xs resize-none"
                />
              </div>

              <button
                type="submit"
                className="vzn-button-primary rounded-xl w-full py-2.5 flex items-center justify-center gap-1 text-xs font-semibold text-white"
              >
                <Plus className="h-4 w-4" />
                Plot Competitor bubble
              </button>
            </form>
          </div>

        </div>

      </div>
    </AppShell>
  )
}
