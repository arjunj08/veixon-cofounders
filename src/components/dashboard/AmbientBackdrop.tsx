'use client'

import CosmicBackdrop from './CosmicBackdrop'

// "Sun Mode" backdrop — deep space base, faint cosmic grid,
// subtle aurora glows, and the full 3D solar system WebGL canvas.
// Shared by every inner app page via AppShell.
export default function AmbientBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Deep space base */}
      <div className="absolute inset-0" style={{ background: 'var(--bg-primary)' }} />

      {/* Full 3D solar system */}
      <CosmicBackdrop />

      {/* Subtle cosmic grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(color-mix(in srgb, var(--purple) 5%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--purple) 5%, transparent) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(120% 90% at 50% 18%, #000 20%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(120% 90% at 50% 18%, #000 20%, transparent 70%)',
        }}
      />

      {/* Warm amber glow (sun halo feel) — top center */}
      <div
        className="absolute"
        style={{
          left: '30%', top: '-20%',
          width: '40vw', height: '40vw',
          background: 'radial-gradient(circle, rgba(255,140,30,0.12), transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Purple aurora — bottom right */}
      <div
        className="absolute"
        style={{
          right: '-10%', bottom: '-15%',
          width: '50vw', height: '50vh',
          background: 'radial-gradient(circle, color-mix(in srgb, var(--purple) 30%, transparent), transparent 70%)',
          filter: 'blur(90px)',
        }}
      />

      {/* Teal aurora — left */}
      <div
        className="absolute"
        style={{
          left: '-12%', bottom: '20%',
          width: '35vw', height: '35vh',
          background: 'radial-gradient(circle, color-mix(in srgb, var(--teal) 20%, transparent), transparent 70%)',
          filter: 'blur(70px)',
        }}
      />

      {/* Readability scrim so text stays crisp over the WebGL canvas */}
      <div className="absolute inset-0 transition-colors duration-500" style={{ background: 'var(--scrim-bg, color-mix(in srgb, var(--bg-primary) 38%, transparent))' }} />
      {/* Edge vignette */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(130% 100% at 50% 0%, transparent 30%, color-mix(in srgb, var(--bg-primary) 75%, transparent) 100%)' }} />
    </div>
  )
}
