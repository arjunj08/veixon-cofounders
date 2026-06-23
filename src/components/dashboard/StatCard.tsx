import { ReactNode } from 'react'

export default function StatCard({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="rounded-lg border p-5" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
      <div className="text-xs font-medium uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}
