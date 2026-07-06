'use client'

import { useState, useRef, useEffect } from 'react'
import { Lock, ShieldAlert, CheckCircle2 } from 'lucide-react'

interface VaultLockMeshProps {
  taskCompletion: number
  accountability: number
  traction: boolean
}

export default function VaultLockMesh({ taskCompletion, accountability, traction }: VaultLockMeshProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate progress percentages
  const taskPercent = Math.min(100, Math.round((taskCompletion || 0) * 100))
  const accPercent = Math.min(100, Math.round(accountability || 0))

  // SVG parameters for progress arcs
  const radius = 95
  const circumference = 2 * Math.PI * radius
  
  const taskOffset = circumference - (taskPercent / 100) * circumference
  const accOffset = circumference - (accPercent / 100) * circumference

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    // Tilt angle calculation (max 25 degrees for deep parallax)
    const rx = -(y / (rect.height / 2)) * 25
    const ry = (x / (rect.width / 2)) * 25
    
    setTilt({ x: rx, y: ry })
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 })
    setIsHovered(false)
  }

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center h-[300px] w-[300px] mx-auto select-none"
      style={{ perspective: '1000px' }}
    >
      {/* Background ambient radial glow */}
      <div 
        className="absolute inset-4 rounded-full blur-[54px] opacity-50 transition-all duration-500"
        style={{
          background: traction 
            ? 'radial-gradient(circle, var(--teal) 0%, rgba(16,185,129,0.1) 50%, transparent 80%)' 
            : 'radial-gradient(circle, var(--purple) 0%, rgba(99,102,241,0.1) 50%, transparent 80%)',
          transform: `translate3d(${tilt.y * 0.7}px, ${-tilt.x * 0.7}px, -30px)`,
        }}
      />

      {/* Main 3D Dial Body (Metallic Brushed Casing) */}
      <div
        className="relative flex items-center justify-center h-[260px] w-[260px] rounded-full border transition-all duration-300 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(10px)`,
          transformStyle: 'preserve-3d',
          borderColor: isHovered ? 'var(--purple)' : 'rgba(255,255,255,0.08)',
          background: 'conic-gradient(from 180deg at 50% 50%, #0d0c1d 0%, #17153a 25%, #0d0c1d 50%, #2e2a72 75%, #0d0c1d 100%)',
          boxShadow: isHovered 
            ? '0 30px 60px -15px rgba(0, 0, 0, 0.95), 0 0 40px 4px rgba(99, 102, 241, 0.35), inset 0 0 25px rgba(255, 255, 255, 0.05)' 
            : '0 15px 35px -10px rgba(0, 0, 0, 0.8), inset 0 0 15px rgba(255, 255, 255, 0.02)',
        }}
      >
        {/* Glow Filters & SVG Progress Rings */}
        <svg 
          className="absolute inset-0 h-full w-full -rotate-90 pointer-events-none"
          style={{ transform: 'translateZ(20px)' }}
        >
          <defs>
            <filter id="neon-glow-purple" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="neon-glow-teal" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ticks circle */}
          <circle
            cx="130"
            cy="130"
            r="115"
            fill="none"
            stroke="var(--border)"
            strokeWidth="2.5"
            strokeDasharray="4, 10"
            className="opacity-50 animate-[spin_100s_linear_infinite]"
            style={{ transformOrigin: 'center' }}
          />

          {/* Task Completion Arc (Purple Glow) */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            fill="none"
            stroke="var(--purple)"
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={taskOffset}
            strokeLinecap="round"
            filter="url(#neon-glow-purple)"
            className="transition-all duration-1000 ease-out opacity-90"
          />

          {/* Accountability Arc (Teal Glow) */}
          <circle
            cx="130"
            cy="130"
            r="75"
            fill="none"
            stroke="var(--teal)"
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={accOffset}
            strokeLinecap="round"
            filter="url(#neon-glow-teal)"
            className="transition-all duration-1000 ease-out opacity-85"
          />
        </svg>

        {/* Outer rotating combination scale ticks */}
        <div 
          className="absolute inset-5 rounded-full border border-dashed opacity-40 animate-[spin_60s_linear_infinite]"
          style={{ borderColor: 'rgba(129, 140, 248, 0.4)', transform: 'translateZ(25px)' }}
        />

        {/* Glassmorphic Inner Dial Face */}
        <div 
          className="absolute h-[160px] w-[160px] rounded-full border flex items-center justify-center backdrop-blur-xl"
          style={{
            transform: 'translateZ(35px)',
            borderColor: 'rgba(255, 255, 255, 0.16)',
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%)',
            boxShadow: 'inset 0 4px 15px rgba(255, 255, 255, 0.08), 0 15px 30px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* Internal Lock Hub Cylinder (Conic Conical Dial) */}
          <div
            className="relative h-[100px] w-[100px] rounded-full border flex items-center justify-center transition-transform duration-500 ease-out"
            style={{
              transform: `translateZ(20px) rotate(${isHovered ? 45 : 0}deg)`,
              borderColor: 'rgba(99, 102, 241, 0.4)',
              background: 'conic-gradient(from 0deg at 50% 50%, #06050e 0%, #312e81 30%, #06050e 50%, #4f46e5 80%, #06050e 100%)',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6), inset 0 2px 8px rgba(255, 255, 255, 0.15)',
            }}
          >
            {/* Status Core Indicator Dot */}
            <div 
              className={`absolute top-2.5 left-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full transition-all duration-500 ${
                traction ? 'bg-[var(--teal)] shadow-[0_0_15px_var(--teal)]' : 'bg-[var(--red)] shadow-[0_0_15px_var(--red)]'
              }`}
            />

            {/* Glowing Center Lock Badge */}
            <div 
              className="flex items-center justify-center h-[58px] w-[58px] rounded-full"
              style={{
                background: 'radial-gradient(circle, #1a1936 0%, #090818 100%)',
                boxShadow: isHovered 
                  ? 'inset 0 0 15px rgba(99, 102, 241, 0.6)' 
                  : 'inset 0 0 8px rgba(0, 0, 0, 0.9)',
              }}
            >
              {traction ? (
                <CheckCircle2 className="h-6 w-6 text-[var(--teal)] animate-pulse" />
              ) : (
                <Lock className="h-5 w-5 text-[var(--purple)] transition-transform duration-300" style={{ filter: isHovered ? 'drop-shadow(0 0 5px var(--purple))' : undefined }} />
              )}
            </div>
          </div>
        </div>

        {/* Floating status tag indicator */}
        <div 
          className="absolute bottom-6 px-3.5 py-0.5 rounded-full border text-[9px] font-mono tracking-widest uppercase transition-opacity duration-300"
          style={{
            transform: 'translateZ(55px)',
            background: 'rgba(11, 11, 20, 0.9)',
            borderColor: traction ? 'var(--teal)' : 'var(--purple)',
            color: traction ? 'var(--teal)' : 'var(--purple)',
            boxShadow: traction ? '0 0 10px rgba(16,185,129,0.3)' : '0 0 10px rgba(99,102,241,0.3)',
            opacity: isHovered ? 1 : 0.8
          }}
        >
          {traction ? 'Core Verified' : 'Locked'}
        </div>
      </div>
    </div>
  )
}
