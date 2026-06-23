import LogoButton from '@/components/ui/LogoButton'

export default function Footer() {
  return (
    <footer className="relative z-10 border-t px-6 py-8" style={{ borderColor: 'var(--border)' }}>
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm md:flex-row" style={{ color: 'var(--text-muted)' }}>
        <LogoButton size="sm" />
        <span>Copyright 2026 VEIXON Co-founders - Decide Smarter. Move Faster.</span>
      </div>
    </footer>
  )
}
