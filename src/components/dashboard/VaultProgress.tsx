export default function VaultProgress({ label, current, target }: { label: string; current: number; target: number }) {
  const pct = Math.min(100, target ? (current / target) * 100 : 0)

  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span>{label}</span>
        <span style={{ color: 'var(--text-muted)' }}>{Math.round(current)}/{target}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full" style={{ background: 'var(--border)' }}>
        <div className="h-full rounded-full bg-[var(--purple)] transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
