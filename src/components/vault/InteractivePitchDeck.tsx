'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, FileText, ExternalLink, Sparkles, Award } from 'lucide-react'

interface Slide {
  slideNumber: number
  title: string
  headline: string
  bullets: string[]
  vznNote: string
}

interface InteractivePitchDeckProps {
  slides: Slide[]
  onExportPdf: () => void
  isFallback?: boolean
}

export default function InteractivePitchDeck({ slides, onExportPdf, isFallback = false }: InteractivePitchDeckProps) {
  const [activeSlide, setActiveSlide] = useState(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') {
        setActiveSlide((prev) => Math.max(0, prev - 1))
      } else if (e.key === 'ArrowRight') {
        setActiveSlide((prev) => Math.min(slides.length - 1, prev + 1))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [slides.length])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    // Smooth responsive tilt
    const rx = -(y / (rect.height / 2)) * 12
    const ry = (x / (rect.width / 2)) * 12
    
    setTilt({ x: rx, y: ry })
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 })
    setIsHovered(false)
  }

  const current = slides[activeSlide] || slides[0]

  return (
    <div className="w-full select-none">
      {/* Deck Controller and Badges */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          {isFallback ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20">
              <Sparkles className="h-3 w-3 animate-pulse" />
              Template Guide (Click Generate Deck)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-2.5 py-1 text-xs font-semibold text-teal-400 border border-teal-500/20">
              <Award className="h-3 w-3" />
              VZN AI Generated Deck
            </span>
          )}
        </div>
        <div className="text-sm font-semibold text-[var(--text-muted)]">
          Slide <span className="text-[var(--text-primary)] font-bold">{activeSlide + 1}</span> of {slides.length}
        </div>
      </div>

      {/* 3D Scene Viewport */}
      <div 
        className="relative w-full min-h-[380px] md:min-h-[420px] flex items-center justify-center py-6 overflow-visible"
        style={{ perspective: '1400px' }}
      >
        {/* Background Ambient Radial Glow */}
        <div 
          className="absolute h-64 w-96 rounded-full blur-[100px] opacity-25 pointer-events-none transition-all duration-700"
          style={{
            background: isFallback 
              ? 'radial-gradient(circle, var(--amber) 0%, rgba(245,158,11,0.05) 60%, transparent 100%)' 
              : 'radial-gradient(circle, var(--purple) 0%, rgba(99,102,241,0.05) 60%, transparent 100%)',
            transform: `translate3d(${tilt.y * 1.5}px, ${-tilt.x * 1.5}px, -50px)`,
          }}
        />

        {/* 3D Card Stack Container */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          className="relative w-full max-w-[780px] aspect-[16/9] transition-all duration-300 ease-out"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(10px)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Back Card (Left/Previous Slide Ghost Card) */}
          {activeSlide > 0 && (
            <div 
              onClick={() => setActiveSlide(activeSlide - 1)}
              className="absolute inset-0 rounded-[1.5rem] border border-white/5 bg-[#0e0c1f]/40 backdrop-blur-sm cursor-pointer opacity-30 transition-all duration-300 hover:opacity-50 hidden md:block"
              style={{
                transform: 'translate3d(-80px, 0, -80px) rotateY(15deg) scale(0.9)',
                pointerEvents: isHovered ? 'auto' : 'none',
              }}
            >
              <div className="p-6">
                <span className="text-xs text-[var(--purple)]">{slides[activeSlide - 1].slideNumber}. {slides[activeSlide - 1].title}</span>
                <h4 className="mt-2 text-lg font-bold text-white/40 line-clamp-1">{slides[activeSlide - 1].headline}</h4>
              </div>
            </div>
          )}

          {/* Back Card (Right/Next Slide Ghost Card) */}
          {activeSlide < slides.length - 1 && (
            <div 
              onClick={() => setActiveSlide(activeSlide + 1)}
              className="absolute inset-0 rounded-[1.5rem] border border-white/5 bg-[#0e0c1f]/40 backdrop-blur-sm cursor-pointer opacity-30 transition-all duration-300 hover:opacity-50 hidden md:block"
              style={{
                transform: 'translate3d(80px, 0, -80px) rotateY(-15deg) scale(0.9)',
                pointerEvents: isHovered ? 'auto' : 'none',
              }}
            >
              <div className="p-6 text-right">
                <span className="text-xs text-[var(--purple)]">{slides[activeSlide + 1].slideNumber}. {slides[activeSlide + 1].title}</span>
                <h4 className="mt-2 text-lg font-bold text-white/40 line-clamp-1">{slides[activeSlide + 1].headline}</h4>
              </div>
            </div>
          )}

          {/* Center Main Slide Card */}
          <div 
            className="absolute inset-0 rounded-[1.8rem] border p-6 md:p-8 flex flex-col justify-between transition-all duration-300"
            style={{
              borderColor: isHovered ? 'var(--purple)' : 'rgba(255,255,255,0.08)',
              background: 'linear-gradient(135deg, rgba(23, 21, 58, 0.95) 0%, rgba(13, 12, 29, 0.98) 100%)',
              boxShadow: isHovered 
                ? '0 35px 70px -15px rgba(0, 0, 0, 0.95), 0 0 40px 1px rgba(99, 102, 241, 0.2), inset 0 1px 1px rgba(255,255,255,0.1)' 
                : '0 20px 45px -10px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255,255,255,0.03)',
              transform: 'translateZ(30px)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Holographic glowing top edge */}
            <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-[var(--purple)] to-transparent opacity-50" />

            <div style={{ transform: 'translateZ(25px)' }} className="flex justify-between items-start">
              <div>
                <span className="text-xs tracking-wider uppercase font-semibold text-[var(--purple)]">
                  {current?.slideNumber}/13 · {current?.title}
                </span>
                <h3 className="mt-3 text-2xl md:text-3.5xl font-black text-white leading-tight">
                  {current?.headline}
                </h3>
              </div>
              {/* Slide number Badge */}
              <span className="h-9 w-9 rounded-full bg-[var(--purple)]/15 border border-[var(--purple)]/20 flex items-center justify-center text-sm font-black text-[var(--purple)]">
                {current?.slideNumber}
              </span>
            </div>

            <div style={{ transform: 'translateZ(20px)' }} className="my-5 flex-grow">
              <ul className="space-y-3">
                {current?.bullets?.map((bullet: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm md:text-base text-gray-300">
                    <span className="text-[var(--purple)] font-bold mt-0.5">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ transform: 'translateZ(15px)' }} className="border-t border-white/5 pt-4 flex justify-between items-center">
              <p className="italic text-xs md:text-sm text-[var(--teal)] font-medium">
                ⚡ VZN Voice: {current?.vznNote}
              </p>
              <div className="hidden sm:flex gap-1">
                <div className="h-1.5 w-6 rounded-full bg-[var(--purple)]" />
                <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
                <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
              </div>
            </div>
          </div>
        </div>

        {/* 3D Navigation Controls Overlay */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none z-20">
          <button 
            onClick={() => setActiveSlide((prev) => Math.max(0, prev - 1))}
            disabled={activeSlide === 0}
            className="h-12 w-12 rounded-full border border-white/5 bg-[#0e0c1f]/80 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:border-[var(--purple)] pointer-events-auto transition-all disabled:opacity-30 disabled:pointer-events-none hover:scale-110 active:scale-95"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={() => setActiveSlide((prev) => Math.min(slides.length - 1, prev + 1))}
            disabled={activeSlide === slides.length - 1}
            className="h-12 w-12 rounded-full border border-white/5 bg-[#0e0c1f]/80 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:border-[var(--purple)] pointer-events-auto transition-all disabled:opacity-30 disabled:pointer-events-none hover:scale-110 active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Visual Thumbnail Carousel Tracker */}
      <div className="mt-4 px-1">
        <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Slide Index</h4>
        <div className="flex gap-2 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-white/10">
          {slides.map((slide, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`flex-shrink-0 flex flex-col justify-between items-start p-3 w-[115px] h-[72px] rounded-xl border text-left transition-all duration-300 ${
                idx === activeSlide
                  ? 'border-[var(--purple)] bg-[var(--purple)]/10 shadow-[0_0_15px_rgba(99,102,241,0.15)] scale-105'
                  : 'border-white/5 bg-[#0e0c1f]/40 hover:border-white/20 hover:bg-[#0e0c1f]/80'
              }`}
            >
              <span className={`text-[10px] font-bold ${idx === activeSlide ? 'text-[var(--purple)]' : 'text-gray-500'}`}>
                Slide {idx + 1}
              </span>
              <span className="text-xs font-extrabold text-white truncate w-full">
                {slide.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="mt-6 flex flex-wrap gap-3 items-center justify-between border-t border-white/5 pt-4">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={onExportPdf} 
            className="vzn-button-ghost inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold border border-white/5 hover:border-[var(--purple)] transition-all hover:bg-[var(--purple)]/5"
          >
            <FileText className="h-4 w-4" /> Export PDF
          </button>
          <a 
            href="https://slides.new" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="vzn-button-ghost inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold border border-white/5 hover:border-[var(--purple)] transition-all hover:bg-[var(--purple)]/5"
          >
            Create in Google Slides <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
