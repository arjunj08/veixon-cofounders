export default function BurnClock({ burnRate = 0, cashInBank = 0, monthlyRevenue = 0 }) {
  const netBurn = Math.max(Number(burnRate) - Number(monthlyRevenue), 0)
  const days = netBurn > 0 ? Math.floor((Number(cashInBank) / netBurn) * 30) : Number(cashInBank) > 0 ? 365 : 0
  const color = days < 30 ? 'var(--red)' : days < 60 ? 'var(--amber)' : 'var(--teal)'

  return (
    <div>
      <div className="text-4xl font-bold tabular-nums" style={{ color }}>
        {days > 365 ? '365+' : days}
      </div>
      <div className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>days runway</div>
    </div>
  )
}
