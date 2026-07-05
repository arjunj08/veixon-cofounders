'use client'

import { useEffect, useRef } from 'react'

export default function CosmicBackdrop() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let rafId: number
    let width = 0
    let height = 0

    // Set canvas dimensions
    const resize = () => {
      width = container.offsetWidth
      height = container.offsetHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) // Optimize crispness vs rendering overhead
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
    }
    resize()

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)

    /* ── static stars (generated once) ── */
    const stars: { x: number; y: number; r: number; phase: number; spd: number }[] = []
    const starCount = 120
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 0.95 + 0.3,
        phase: Math.random() * Math.PI * 2,
        spd: Math.random() * 0.02 + 0.015,
      })
    }

    /* ── static asteroids (generated once) ── */
    const asteroids: { a: number; rMult: number; yOffset: number; size: number }[] = []
    const asteroidCount = 380
    for (let i = 0; i < asteroidCount; i++) {
      asteroids.push({
        a: Math.random() * Math.PI * 2,
        rMult: 1.0 + (Math.random() - 0.5) * 0.08,
        yOffset: (Math.random() - 0.5) * 6,
        size: Math.random() * 0.65 + 0.3,
      })
    }

    /* ── planet specs ── */
    const PLANET_SPECS = [
      { name: 'mercury', r: 70, size: 3.5, spd: 0.72, color: ['#ff9966', '#3a2010'] },
      { name: 'venus', r: 100, size: 5.5, spd: 0.54, color: ['#ffe57f', '#b5651d'] },
      { name: 'earth', r: 135, size: 6.0, spd: 0.42, isEarth: true },
      { name: 'mars', r: 170, size: 4.5, spd: 0.33, color: ['#ff5252', '#880e4f'] },
      { name: 'jupiter', r: 225, size: 13.5, spd: 0.21, isJupiter: true },
      { name: 'saturn', r: 285, size: 11.0, spd: 0.15, isSaturn: true },
      { name: 'uranus', r: 345, size: 8.0, spd: 0.10, color: ['#64ffda', '#00b0ff'] },
      { name: 'neptune', r: 400, size: 8.0, spd: 0.07, color: ['#2979ff', '#1a237e'] },
    ]

    const planetInstances = PLANET_SPECS.map((p) => ({
      ...p,
      startAngle: Math.random() * Math.PI * 2,
    }))

    /* ── mouse parallax tracking ── */
    const ptr = { x: 0, y: 0, targetX: 0, targetY: 0 }
    const onMouseMove = (e: MouseEvent) => {
      ptr.targetX = (e.clientX / window.innerWidth - 0.5) * 2
      ptr.targetY = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    /* ── animation loop ── */
    const startTime = Date.now()

    const render = () => {
      rafId = requestAnimationFrame(render)

      const time = (Date.now() - startTime) * 0.001

      // 1. Clear Canvas
      ctx.clearRect(0, 0, width, height)

      // 2. Parallax Lerp
      ptr.x += (ptr.targetX - ptr.x) * 0.05
      ptr.y += (ptr.targetY - ptr.y) * 0.05

      const cx = width / 2 + ptr.x * 24
      const cy = height / 2.3 - ptr.y * 14

      // Scale planets and orbits relative to viewport
      const baseScale = Math.min(width / 1000, 1.25)
      const tilt = 0.38 // Elliptical height factor

      // 3. Theme Check
      const isDark = !document.documentElement.classList.contains('light')

      // 4. Draw Twinkling Stars (only in dark mode)
      if (isDark) {
        ctx.fillStyle = '#ffffff'
        stars.forEach((s) => {
          const tw = 0.3 + Math.sin(time * s.spd * 50 + s.phase) * 0.7
          ctx.globalAlpha = s.r * tw
          ctx.beginPath()
          ctx.arc(s.x * width, s.y * height, s.r, 0, Math.PI * 2)
          ctx.fill()
        })
        ctx.globalAlpha = 1.0
      }

      // 5. Draw Orbit Lines (Faint violet/grey or Brand purple)
      ctx.strokeStyle = isDark ? 'rgba(188, 208, 234, 0.14)' : 'rgba(83, 74, 183, 0.28)'
      ctx.lineWidth = 1
      planetInstances.forEach((p) => {
        const rx = p.r * baseScale
        const ry = rx * tilt
        ctx.beginPath()
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
        ctx.stroke()
      })

      // 6. Precompute positions and split by depth (Y coordinate relative to center)
      const activePlanets = planetInstances.map((p) => {
        const rx = p.r * baseScale
        const ry = rx * tilt
        const angle = p.startAngle + time * p.spd * 0.12
        const px = cx + Math.cos(angle) * rx
        const py = cy + Math.sin(angle) * ry
        const size = p.size * Math.max(0.7, baseScale)
        return { ...p, px, py, size, angle }
      })

      // Partition asteroids into back half (y < cy) and front half (y >= cy)
      const astRadius = 200 * baseScale
      const astRY = astRadius * tilt
      const astBack: { x: number; y: number }[] = []
      const astFront: { x: number; y: number }[] = []

      asteroids.forEach((ast) => {
        const angle = ast.a + time * 0.018
        const r = astRadius * ast.rMult
        const ry = astRY * ast.rMult
        const ax = cx + Math.cos(angle) * r
        const ay = cy + Math.sin(angle) * ry + ast.yOffset
        if (ay < cy) {
          astBack.push({ x: ax, y: ay })
        } else {
          astFront.push({ x: ax, y: ay })
        }
      })

      // Draw asteroids helper
      const drawAsteroids = (list: { x: number; y: number }[]) => {
        ctx.fillStyle = isDark ? 'rgba(205, 183, 138, 0.75)' : 'rgba(130, 110, 80, 0.6)'
        list.forEach((pt) => {
          ctx.fillRect(pt.x, pt.y, 1, 1)
        })
      }

      // Draw planet helper
      const drawPlanet = (p: typeof activePlanets[0]) => {
        const px = p.px
        const py = p.py
        const size = p.size

        const grad = ctx.createRadialGradient(px - size * 0.3, py - size * 0.3, 0, px, py, size)

        if (p.isEarth) {
          // Earth: Electric blue / Emerald Green contrast
          grad.addColorStop(0, '#40c4ff')
          grad.addColorStop(0.55, '#00e676')
          grad.addColorStop(1, '#0d47a1')
        } else if (p.isJupiter) {
          // Jupiter: High contrast orange/cream/red bands
          grad.addColorStop(0, '#ffe0b2')
          grad.addColorStop(0.3, '#ffb74d')
          grad.addColorStop(0.65, '#e64a19')
          grad.addColorStop(1, '#3e2723')
        } else if (p.isSaturn) {
          // Saturn: Golden-yellow
          grad.addColorStop(0, '#fff59d')
          grad.addColorStop(0.5, '#ffe082')
          grad.addColorStop(1, '#f57c00')
        } else if (p.color) {
          grad.addColorStop(0, p.color[0])
          grad.addColorStop(1, p.color[1])
        }

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(px, py, size, 0, Math.PI * 2)
        ctx.fill()

        // Great Red Spot on Jupiter
        if (p.isJupiter) {
          ctx.fillStyle = '#b71c1c'
          ctx.beginPath()
          ctx.ellipse(px + size * 0.3, py + size * 0.2, size * 0.25, size * 0.15, -0.1, 0, Math.PI * 2)
          ctx.fill()
        }

        // Saturn Ring
        if (p.isSaturn) {
          ctx.save()
          ctx.translate(px, py)
          ctx.rotate(0.2) // Rotate ring to match tilt
          ctx.scale(1.9, 0.6)
          ctx.strokeStyle = isDark ? 'rgba(255, 204, 68, 0.85)' : 'rgba(220, 160, 40, 0.85)'
          ctx.lineWidth = size * 0.28
          ctx.beginPath()
          ctx.arc(0, 0, size, 0, Math.PI * 2)
          ctx.stroke()
          ctx.restore()
        }
      };

      // ── Depth Sorted Rendering ──

      // 7. Draw Back-Half Asteroids
      if (isDark) drawAsteroids(astBack)

      // 8. Draw Back-Half Planets (y < cy)
      activePlanets
        .filter((p) => p.py < cy)
        .sort((a, b) => a.py - b.py)
        .forEach(drawPlanet)

      // 9. Draw the Sun
      // Corona 2
      const sunR2 = (52 + Math.cos(time * 1.8) * 4) * baseScale
      const gSun2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunR2)
      gSun2.addColorStop(0, 'rgba(255, 112, 30, 0.22)')
      gSun2.addColorStop(0.5, 'rgba(255, 80, 20, 0.06)')
      gSun2.addColorStop(1, 'rgba(255, 80, 20, 0)')
      ctx.fillStyle = gSun2
      ctx.beginPath()
      ctx.arc(cx, cy, sunR2, 0, Math.PI * 2)
      ctx.fill()

      // Corona 1
      const sunR1 = (36 + Math.sin(time * 2.5) * 2.5) * baseScale
      const gSun1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunR1)
      gSun1.addColorStop(0, 'rgba(255, 172, 58, 0.45)')
      gSun1.addColorStop(0.4, 'rgba(255, 120, 30, 0.18)')
      gSun1.addColorStop(1, 'rgba(255, 80, 20, 0)')
      ctx.fillStyle = gSun1
      ctx.beginPath()
      ctx.arc(cx, cy, sunR1, 0, Math.PI * 2)
      ctx.fill()

      // Bright Sun Core
      const sunCoreR = 19 * baseScale
      const gCore = ctx.createRadialGradient(cx - sunCoreR * 0.15, cy - sunCoreR * 0.15, 0, cx, cy, sunCoreR)
      gCore.addColorStop(0, '#ffffff')
      gCore.addColorStop(0.2, '#fff4d6')
      gCore.addColorStop(0.65, '#ffcc44')
      gCore.addColorStop(1, '#ff6d00')
      ctx.fillStyle = gCore
      ctx.beginPath()
      ctx.arc(cx, cy, sunCoreR, 0, Math.PI * 2)
      ctx.fill()

      // 10. Draw Front-Half Asteroids
      if (isDark) drawAsteroids(astFront)

      // 11. Draw Front-Half Planets (y >= cy)
      activePlanets
        .filter((p) => p.py >= cy)
        .sort((a, b) => a.py - b.py)
        .forEach(drawPlanet)
    }

    render()

    return () => {
      cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="absolute inset-0 pointer-events-none z-0"
      style={{ overflow: 'hidden' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" />
    </div>
  )
}
