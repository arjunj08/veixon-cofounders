// Branded, email-client-safe HTML (inline styles, table layout, dark theme).
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'https://visionixfounders.com'

const PURPLE = '#6D5DF6'
const BG = '#0b0b14'
const CARD = '#15151f'
const TEXT = '#f4f5fa'
const MUTED = '#9a9ab2'

function shell(opts: { heading: string; body: string; ctaText?: string; ctaUrl?: string; footnote?: string }) {
  const cta = opts.ctaText && opts.ctaUrl
    ? `<tr><td style="padding:28px 0 4px;">
         <a href="${opts.ctaUrl}" style="display:inline-block;background:${PURPLE};color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 26px;border-radius:12px;">${opts.ctaText}</a>
       </td></tr>`
    : ''
  return `<!DOCTYPE html><html><body style="margin:0;background:${BG};font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:32px 16px;">
   <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:${CARD};border:1px solid #2a2a3a;border-radius:18px;padding:34px;">
      <tr><td style="font-weight:800;letter-spacing:3px;font-size:13px;color:${TEXT};padding-bottom:6px;">VE<span style="color:${PURPLE};">I</span>XON</td></tr>
      <tr><td style="font-family:monospace;font-size:10px;letter-spacing:2px;color:${MUTED};text-transform:uppercase;padding-bottom:22px;">VZN · your co-founder</td></tr>
      <tr><td style="font-size:22px;font-weight:800;color:${TEXT};line-height:1.25;padding-bottom:12px;">${opts.heading}</td></tr>
      <tr><td style="font-size:15px;color:${MUTED};line-height:1.65;">${opts.body}</td></tr>
      ${cta}
      <tr><td style="border-top:1px solid #2a2a3a;margin-top:24px;padding-top:18px;color:#5c5c70;font-size:12px;line-height:1.6;">${opts.footnote || 'VEIXON Co-Founders — decide smarter, move faster.'}</td></tr>
    </table>
   </td></tr>
  </table></body></html>`
}

export function welcomeEmail(name: string) {
  return {
    subject: "You're in. VZN does not sugarcoat.",
    html: shell({
      heading: `Welcome, ${escape(name)}.`,
      body: `I am VZN, your AI co-founder. Let's make one thing clear: I am not here to congratulate you or tell you your ideas are genius. 90% of startups die of comfort, self-delusion, and vanity metrics. I refuse to let you lie to yourself.<br/><br/>I will grade your startup idea brutally and honestly, point out exactly what will kill it, and generate a strict 90-day plan of pure action. If you're looking for validation or a pat on the back, you're in the wrong place. If you're ready to do the hard work, submit your idea now.`,
      ctaText: 'Analyse my idea',
      ctaUrl: `${APP_URL}/intake`,
    }),
  }
}

export function analysisReportEmail(name: string, args: { idea: string; failureProbability?: number; composite?: number; vzn?: string; startupId?: string }) {
  const fp = typeof args.failureProbability === 'number' ? `~${args.failureProbability}%` : '—'
  const comp = typeof args.composite === 'number' ? `${args.composite}/10` : '—'
  return {
    subject: 'Your brutal idea report is ready.',
    html: shell({
      heading: 'I ran the numbers on your idea.',
      body: `<strong style="color:${TEXT};">"${escape(args.idea).slice(0, 140)}"</strong><br/><br/>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 14px;">
          <tr>
            <td style="padding-right:28px;"><div style="font-size:28px;font-weight:800;color:#f2585b;">${fp}</div><div style="font-size:11px;color:${MUTED};">estimated failure risk</div></td>
            <td><div style="font-size:28px;font-weight:800;color:${TEXT};">${comp}</div><div style="font-size:11px;color:${MUTED};">composite score</div></td>
          </tr>
        </table>
        ${args.vzn ? `<em style="color:${MUTED};">"${escape(args.vzn)}"</em><br/><br/>` : ''}
        These are directional estimates from the framework + your inputs — open the full scorecard, devil's advocate, and 90-day war plan.`,
      ctaText: 'See the full report',
      ctaUrl: `${APP_URL}/results/${args.startupId || 'latest'}`,
    }),
  }
}

export function decisionEmail(name: string, args: { description?: string; recommendation?: string; reasoning?: string }) {
  return {
    subject: 'VZN ran your decision.',
    html: shell({
      heading: 'I simulated your decision.',
      body: `${args.description ? `<strong style="color:${TEXT};">"${escape(args.description).slice(0, 160)}"</strong><br/><br/>` : ''}
        <div style="font-family:monospace;font-size:10px;letter-spacing:2px;color:${PURPLE};text-transform:uppercase;">My call</div>
        <div style="font-size:17px;font-weight:700;color:${TEXT};margin:4px 0 10px;">${escape(args.recommendation || 'See the simulation in-app.')}</div>
        ${args.reasoning ? `<span style="color:${MUTED};">${escape(args.reasoning).slice(0, 280)}</span>` : ''}`,
      ctaText: 'Open the decision',
      ctaUrl: `${APP_URL}/decisions`,
    }),
  }
}

export function inactivityWarningEmail(name: string, args: { dayNumber?: number; lastActiveDays?: number }) {
  const gap = args.lastActiveDays && args.lastActiveDays > 1 ? `${args.lastActiveDays} days` : 'a day'
  return {
    subject: '⚠ You went dark. Access your 90-day war plan.',
    html: shell({
      heading: `You went silent, ${escape(name)}.`,
      body: `You haven't shown up for ${gap}. Starting a company isn't about looking busy; it's about compounding momentum. Every day you skip is a day your competition gets ahead. I refuse to let you slip into comfort.<br/><br/>Stop hiding. Go to the dashboard, face the reality of your execution, and kindly access your 90-day war plan to get back on track. One task today is better than a perfect plan tomorrow.`,
      ctaText: 'Access my 90-day plan',
      ctaUrl: `${APP_URL}/dashboard`,
      footnote: 'No excuses. Face your dashboard.',
    }),
  }
}

export function dayOneCompleteEmail(name: string, args: { task?: string }) {
  return {
    subject: 'Day 1 is done. That matters.',
    html: shell({
      heading: `Day 1 complete, ${escape(name)}.`,
      body: `Most people keep their startup in their head. You moved one task into evidence.<br/><br/>
        ${args.task ? `<strong style="color:${TEXT};">Completed:</strong> ${escape(args.task).slice(0, 180)}<br/><br/>` : ''}
        Quote for today: <em style="color:${TEXT};">"The secret of getting ahead is getting started."</em><br/><br/>
        Small proof compounds. Come back tomorrow and make Day 2 visible too.`,
      ctaText: 'Open my dashboard',
      ctaUrl: `${APP_URL}/dashboard`,
      footnote: 'VEIXON Co-founders, a product by VEIXON Tech.',
    }),
  }
}

// minimal HTML escape for interpolated user content
function escape(s: string): string {
  return String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))
}
