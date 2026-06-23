'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)
  const position = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const hover = useRef(false)
  const click = useRef(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    setEnabled(true)
    document.body.style.cursor = 'none'

    const move = (event: MouseEvent) => {
      position.current = { x: event.clientX, y: event.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${event.clientX - 4}px, ${event.clientY - 4}px, 0)`
      }
    }

    const over = (event: MouseEvent) => {
      hover.current = !!(event.target as HTMLElement).closest('a, button, [data-cursor-grow]')
    }
    const down = () => {
      click.current = true
      window.setTimeout(() => {
        click.current = false
      }, 150)
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    window.addEventListener('mousedown', down)

    let frame = 0
    const tick = () => {
      ring.current.x += (position.current.x - ring.current.x) * 0.12
      ring.current.y += (position.current.y - ring.current.y) * 0.12
      const scale = click.current ? 0.8 : hover.current ? 1.6 : 1
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x - 14}px, ${ring.current.y - 14}px, 0) scale(${scale})`
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      document.body.style.cursor = ''
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      window.removeEventListener('mousedown', down)
      cancelAnimationFrame(frame)
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <div ref={dotRef} className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-[var(--purple)]" />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-7 w-7 rounded-full border transition-transform duration-75"
        style={{ borderColor: 'color-mix(in srgb, var(--purple) 60%, transparent)' }}
      />
    </>
  )
}
