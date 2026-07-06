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
  const radius = 90
  const circumference = 2 * Math.PI * radius
  
  const taskOffset = circumference - (taskPercent / 100) * circumference
  const accOffset = circumference - (accPercent / 100) * circumference

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    // Tilt angle calculation (max 22 degrees)
    const rx = -(y / (rect.height / 2)) * 22
    const ry = (x / (rect.width / 2)) * 22
    
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
      className="relative flex items-center justify-center h-[280px] w-[280px] mx-auto select-none"
      style={{ perspective: '1000px' }}
    >
      {/* Background ambient radial glow */}
      <div 
        className="absolute inset-0 rounded-full blur-[48px] opacity-40 transition-opacity duration-500"
        style={{
          background: traction ? 'radial-gradient(circle, var(--teal) 0%, transparent 70%)' : 'radial-gradient(circle, var(--purple) 0%, transparent 70%)',
          transform: `translate3d(${tilt.y * 0.5}px, ${-tilt.x * 0.5}px, -20px)`,
        }}
      />

      {/* Main 3D Dial Body */}
      <div
        className="relative flex items-center justify-center h-[240px] w-[240px] rounded-full border transition-all duration-300 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(10px)`,
          transformStyle: 'preserve-3d',
          borderColor: isHovered ? 'var(--purple)' : 'var(--border)',
          background: 'radial-gradient(circle at 35% 35%, #18182b 0%, #0d0d16 100%)',
          boxShadow: isHovered 
            ? '0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 0 30px 2px rgba(99, 102, 241, 0.25), inset 0 0 15px rgba(255, 255, 255, 0.05)' 
            : '0 10px 25px -10px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.02)',
        }}
      >
        {/* SVG Progress Rings and Dial Ticks (preserve-3d) */}
        <svg 
          className="absolute inset-0 h-full w-full -rotate-90 pointer-events-none"
          style={{ transform: 'translateZ(15px)' }}
        >
          {/* Ticks circle */}
          <circle
            cx="120"
            cy="120"
            r="105"
            fill="none"
            stroke="var(--border)"
            strokeWidth="2"
            strokeDasharray="4, 8"
            className="opacity-40 animate-[spin_120s_linear_infinite]"
            style={{ transformOrigin: 'center' }}
          />

          {/* Task Completion Arc (Purple) */}
          <circle
            cx="120"
            cy="120"
            r={radius}
            fill="none"
            stroke="var(--purple)"
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={taskOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out opacity-80"
          />

          {/* Accountability Arc (Teal) */}
          <circle
            cx="120"
            cy="120"
            r="80"
            fill="none"
            stroke="var(--teal)"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={accOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out opacity-75"
          />
        </svg>

        {/* Outer rotating combination scale ticks */}
        <div 
          className="absolute inset-4 rounded-full border border-dashed opacity-25 animate-[spin_80s_linear_infinite]"
          style={{ borderColor: 'var(--text-muted)', transform: 'translateZ(20px)' }}
        />

        {/* Glassmorphic Inner Dial Face */}
        <div 
          className="absolute h-[150px] w-[150px] rounded-full border flex items-center justify-center backdrop-blur-md"
          style={{
            transform: 'translateZ(30px)',
            borderColor: 'rgba(255, 255, 255, 0.08)',
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0) 100%)',
            boxShadow: 'inset 0 4px 10px rgba(255, 255, 255, 0.05), 0 10px 20px rgba(0, 0, 0, 0.4)',
          }}
        >
          {/* Internal Lock Hub Cylinder (Chrome/Metallic Finish) */}
          <div
            className="relative h-[90px] w-[90px] rounded-full border flex items-center justify-center transition-transform duration-500"
            style={{
              transform: `translateZ(15px) rotate(${isHovered ? 45 : 0}deg)`,
              borderColor: 'rgba(99, 102, 241, 0.3)',
              background: 'linear-gradient(135deg, #1c1a36 0%, #0a0914 100%)',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5), inset 0 2px 5px rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Status Core Indicator Dot */}
            <div 
              className={`absolute top-2 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full transition-all duration-500 ${
                traction ? 'bg-[var(--teal)] shadow-[0_0_10px_var(--teal)]' : 'bg-[var(--red)] shadow-[0_0_10px_var(--red)]'
              }`}
            />

            {/* Glowing Center Lock Badge */}
            <div 
              className="flex items-center justify-center h-[54px] w-[54px] rounded-full"
              style={{
                background: 'radial-gradient(circle, #222046 0%, #111026 100%)',
                boxShadow: isHovered 
                  ? 'inset 0 0 10px rgba(99, 102, 241, 0.5)' 
                  : 'inset 0 0 5px rgba(0, 0, 0, 0.8)',
              }}
            >
              {traction ? (
                <CheckCircle2 className="h-6 w-6 text-[var(--teal)] animate-pulse" />
              ) : (
                <Lock className="h-5 w-5 text-[var(--purple)] transition-transform duration-300 group-hover:scale-110" />
              )}
            </div>
          </div>
        </div>

        {/* Floating status tag indicator */}
        <div 
          className="absolute bottom-6 px-3 py-0.5 rounded-full border text-[9px] font-mono tracking-widest uppercase transition-opacity duration-300"
          style={{
            transform: 'translateZ(40px)',
            background: 'rgba(11, 11, 20, 0.8)',
            borderColor: traction ? 'var(--teal)' : 'var(--purple)',
            color: traction ? 'var(--teal)' : 'var(--purple)',
            opacity: isHovered ? 1 : 0.7
          }}
        >
          {traction ? 'Core Verified' : 'Locked'}
        </div>
      </div>
    </div>
  )
}
