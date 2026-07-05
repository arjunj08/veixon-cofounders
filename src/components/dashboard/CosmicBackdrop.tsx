'use client'

import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  z: number
  size: number
  color: string
}

export default function CosmicBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates around center (-0.5 to 0.5)
      mouseRef.current.targetX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)
      mouseRef.current.targetY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Initialize 100 stars
    const starCount = 100
    const stars: Star[] = []
    const colors = ['#8B5CF6', '#3B82F6', '#06B6D4', '#FFFFFF', '#A78BFA', '#22D3EE']

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: Math.random() * 1000,
        size: Math.random() * 1.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    const render = () => {
      // Smooth interpolation for mouse movement (inertia)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05

      ctx.clearRect(0, 0, width, height)

      // Project and draw each star
      const centerX = width / 2
      const centerY = height / 2

      // Apply subtle mouse offset to create camera parallax
      const cameraOffsetX = mouseRef.current.x * -70
      const cameraOffsetY = mouseRef.current.y * -70

      for (let i = 0; i < starCount; i++) {
        const star = stars[i]

        // If reduced motion is not preferred, move stars forward
        if (!prefersReducedMotion) {
          star.z -= 0.6
        }

        // Reset star if it passes the camera or gets too close
        if (star.z <= 0) {
          star.z = 1000
          star.x = (Math.random() - 0.5) * 2000
          star.y = (Math.random() - 0.5) * 2000
        }

        // 3D Perspective Projection
        const fov = 400
        const projX = (star.x / star.z) * fov + centerX + cameraOffsetX
        const projY = (star.y / star.z) * fov + centerY + cameraOffsetY

        // Calculate visual size & brightness based on depth
        const depthOpacity = (1000 - star.z) / 1000
        const opacity = depthOpacity * 0.75
        const size = star.size * (1.5 - star.z / 1000)

        // Only draw if inside viewport limits
        if (projX >= 0 && projX <= width && projY >= 0 && projY <= height) {
          // Draw soft glowing flare
          ctx.beginPath()
          ctx.arc(projX, projY, size * 2.2, 0, Math.PI * 2)
          ctx.fillStyle = star.color
          ctx.globalAlpha = opacity * 0.25
          ctx.fill()

          ctx.beginPath()
          ctx.arc(projX, projY, size, 0, Math.PI * 2)
          ctx.fillStyle = '#FFFFFF'
          ctx.globalAlpha = opacity
          ctx.fill()
        }
      }

      ctx.globalAlpha = 1.0 // Reset opacity
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
