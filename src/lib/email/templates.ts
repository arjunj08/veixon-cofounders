// Branded, email-client-safe HTML (inline styles, table layout, dark theme).
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'https://visionixfounders.com'

const PURPLE = '#8b5cf6'
const BG = '#080710'
const CARD = '#11101e'
const TEXT = '#ffffff'
const MUTED = '#a7a5c6'

function shell(opts: { heading: string; body: string; ctaText?: string; ctaUrl?: string; footnote?: string }) {
  const cta = opts.ctaText && opts.ctaUrl
    ? `<tr><td style="padding: 30px 0 8px;">
         <a href="${opts.ctaUrl}" style="display: inline-block; background: #8b5cf6; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; letter-spacing: 0.5px; padding: 14px 30px; border-radius: 8px; border: 1px solid #a78bfa; text-align: center; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);">${opts.ctaText}</a>
       </td></tr>`
    : ''
  return `<!DOCTYPE html><html><body style="margin:0;background:${BG};font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:40px 16px;">
   <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:${CARD};border:1px solid #232236;border-top:4px solid #8b5cf6;border-radius:12px;padding:36px;box-shadow:0 10px 30px rgba(0,0,0,0.4);">
      <tr><td>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
          <tr>
            <td>
              <div style="font-size: 18px; font-weight: 900; letter-spacing: 4px; color: #ffffff; text-transform: uppercase; font-family: system-ui, -apple-system, sans-serif;">
                VEIXON<span style="color: #8b5cf6;">.</span>
              </div>
              <div style="font-size: 9px; font-weight: 700; letter-spacing: 2px; color: #8b5cf6; text-transform: uppercase; font-family: monospace; margin-top: 4px;">
                [ VZN // MACHINE CO-FOUNDER ]
              </div>
            </td>
          </tr>
        </table>
      </td></tr>
      <tr><td style="font-size:24px;font-weight:800;color:${TEXT};line-height:1.3;padding-bottom:16px;letter-spacing:-0.5px;">${opts.heading}</td></tr>
      <tr><td style="font-size:15px;color:#d1d5db;line-height:1.7;">${opts.body}</td></tr>
      ${cta}
      <tr><td>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #232236; margin-top: 32px; padding-top: 20px;">
          <tr>
            <td style="color: #6b7280; font-size: 11px; font-family: monospace; letter-spacing: 0.5px; line-height: 1.5;">
              ${opts.footnote || 'VEIXON // CO-FOUNDER CORE ENGINE'}
            </td>
          </tr>
        </table>
      </td></tr>
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
  
  const scorecardHtml = `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 20px 0 24px; width: 100%;">
      <tr>
        <td style="width: 50%; padding-right: 10px;">
          <div style="background: #1f1217; border: 1px solid #ef4444; border-radius: 10px; padding: 18px 12px; text-align: center;">
            <div style="font-size: 32px; font-weight: 900; color: #ef4444; line-height: 1; font-family: monospace;">${fp}</div>
            <div style="font-size: 10px; color: #fca5a5; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-top: 6px;">Failure Risk</div>
          </div>
        </td>
        <td style="width: 50%; padding-left: 10px;">
          <div style="background: #141126; border: 1px solid #8b5cf6; border-radius: 10px; padding: 18px 12px; text-align: center;">
            <div style="font-size: 32px; font-weight: 900; color: #a78bfa; line-height: 1; font-family: monospace;">${comp}</div>
            <div style="font-size: 10px; color: #c084fc; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-top: 6px;">Composite Score</div>
          </div>
        </td>
      </tr>
    </table>
  `

  return {
    subject: 'Your brutal idea report is ready.',
    html: shell({
      heading: 'I ran the numbers on your idea.',
      body: `<strong style="color:${TEXT}; font-size:16px;">"${escape(args.idea).slice(0, 140)}"</strong><br/>
        ${scorecardHtml}
        ${args.vzn ? `<div style="background:#161527; border-left:3px solid #8b5cf6; padding:12px 16px; margin: 16px 0; border-radius: 0 8px 8px 0;"><em style="color:#d1d5db; font-size:14px; line-height:1.5; display:block;">"${escape(args.vzn)}"</em></div>` : ''}
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
      body: `${args.description ? `<strong style="color:${TEXT}; font-size:16px;">"${escape(args.description).slice(0, 160)}"</strong><br/>` : ''}
        <div style="background:#161527; border-left:3px solid #8b5cf6; padding:16px; margin: 20px 0 16px; border-radius: 0 8px 8px 0;">
          <div style="font-family:monospace;font-size:10px;letter-spacing:2px;color:#a78bfa;text-transform:uppercase;margin-bottom:6px;">VZN RECOMMENDATION</div>
          <div style="font-size:17px;font-weight:800;color:#ffffff;line-height:1.4;">${escape(args.recommendation || 'See the simulation in-app.')}</div>
        </div>
        ${args.reasoning ? `<div style="font-size:14px;color:#d1d5db;line-height:1.6;margin-top:12px;">${escape(args.reasoning).slice(0, 280)}</div>` : ''}`,
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
      body: `Most people keep their startup in their head. You moved one task into evidence.<br/>
        ${args.task ? `
        <div style="background:#111827; border: 1px solid #10b981; border-radius: 8px; padding: 14px 16px; margin: 18px 0;">
          <span style="display:inline-block;background:#10b981;color:#ffffff;font-size:10px;font-weight:800;letter-spacing:1px;padding:3px 8px;border-radius:4px;text-transform:uppercase;margin-bottom:8px;font-family:monospace;">COMPLETED</span>
          <div style="font-size:14px;color:#e5e7eb;font-weight:600;line-height:1.4;">${escape(args.task).slice(0, 180)}</div>
        </div>` : ''}
        
        <div style="border-left: 3px solid #10b981; background: #0f171d; padding: 12px 16px; border-radius: 0 8px 8px 0; margin: 20px 0 10px;">
          <div style="font-size: 11px; font-family: monospace; letter-spacing: 1px; color: #10b981; text-transform: uppercase; margin-bottom: 4px;">Quote for today</div>
          <em style="color:#ffffff; font-size:14px; line-height: 1.5; display: block;">"The secret of getting ahead is getting started."</em>
        </div>
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
