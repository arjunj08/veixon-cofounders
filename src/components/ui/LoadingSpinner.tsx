import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ label = 'VZN is thinking...' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
      <Loader2 className="h-4 w-4 animate-spin" style={{ color: 'var(--purple)' }} />
      {label}
    </div>
  )
}
