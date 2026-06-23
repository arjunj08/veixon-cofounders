'use client'

import { useRouter } from 'next/navigation'

export default function DecisionTable({ decisions = [] }: { decisions: any[] }) {
  const router = useRouter()

  if (!decisions.length) {
    return (
      <div className="p-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
        No decisions yet. Run your first simulation.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead style={{ color: 'var(--text-muted)' }}>
          <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
            <th className="px-4 py-3 font-medium">Decision</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Recommendation</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {decisions.map((decision) => (
            <tr
              key={decision.id}
              className="border-b transition-colors hover:bg-[var(--bg-tertiary)]"
              style={{ borderColor: 'var(--border)' }}
              onClick={() => router.push(`/decisions?id=${decision.id}`)}
            >
              <td className="max-w-[280px] truncate px-4 py-4">{decision.description}</td>
              <td className="px-4 py-4" style={{ color: 'var(--text-muted)' }}>{decision.decisionType}</td>
              <td className="max-w-[360px] truncate px-4 py-4 text-[var(--purple)]">{decision.recommendation}</td>
              <td className="px-4 py-4" style={{ color: 'var(--text-muted)' }}>
                {decision.createdAt ? new Date(decision.createdAt).toLocaleDateString() : 'Today'}
              </td>
              <td className="px-4 py-4">
                <span className="rounded-full border px-2 py-1 text-xs" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                  Simulated
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
