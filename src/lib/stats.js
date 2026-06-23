export function averageScore(scorecard) {
  const scores = Object.values(scorecard || {})
    .map(v => v?.score)
    .filter(s => typeof s === 'number')
  if (!scores.length) return null
  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
}

export function pivotStatusFromStartup(startup) {
  if (!startup) return { status: 'AMBER', warning: 'Submit your startup idea to activate Pivot Radar.' }

  const scorecard = startup.scorecard_json || {}
  const avg = averageScore(scorecard)
  const risk = scorecard.risk?.score
  const timing = scorecard.timing?.score
  const highSeverity = (startup.devils_advocate_json || []).some(d => d.severity === 'high')

  if (avg !== null && avg >= 7.5 && risk >= 7 && !highSeverity) {
    return { status: 'GREEN', warning: null }
  }
  if (avg !== null && avg < 5.5 || highSeverity) {
    const topRisk = startup.devils_advocate_json?.[0]
    return {
      status: 'RED',
      warning: topRisk
        ? `Pivot Radar Alert: ${topRisk.title}. ${topRisk.explanation}`
        : 'Pivot Radar Alert: Multiple high-severity risks detected. Re-evaluate core assumptions.',
    }
  }

  const weakDim = Object.entries(scorecard).sort((a, b) => (a[1]?.score ?? 0) - (b[1]?.score ?? 0))[0]
  const dimLabel = weakDim?.[0] || 'execution'
  return {
    status: 'AMBER',
    warning: timing !== undefined && timing < 6
      ? 'Pivot Radar Warning: Market timing looks weak. Validate why now before scaling.'
      : `Pivot Radar Warning: ${dimLabel} score is your weakest signal. Focus there this week.`,
  }
}

export function startupHealthScore(startup) {
  const avg = averageScore(startup?.scorecard_json)
  return avg !== null ? Math.round(avg * 10) : null
}
