'use client'

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")"

export default function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-[-50%] z-[3]"
      style={{ opacity: 0.045, mixBlendMode: 'overlay', backgroundImage: NOISE, animation: 'veixon-grain .6s steps(4) infinite' }}
    />
  )
}
