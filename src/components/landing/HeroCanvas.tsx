'use client'

export default function HeroCanvas({ isDark }: { isDark: boolean }) {
  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden bg-[var(--bg-primary)]">
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className={`h-full w-full object-contain scale-[1.15] transition-all duration-700 ${
          isDark 
            ? 'invert hue-rotate-180 mix-blend-lighten brightness-90 contrast-125' 
            : 'mix-blend-darken brightness-110 contrast-125'
        }`}
      >
        <source src="/globe.mp4" type="video/mp4" />
      </video>
    </div>
  )
}
