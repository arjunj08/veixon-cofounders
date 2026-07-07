import { dispatchEmail } from '@/lib/email/service'

export const runtime = 'nodejs'

// Quick way to verify the mailer end-to-end without signing in/out.
//   GET /api/email/test?to=you@example.com
// Protected by CRON_SECRET in production; open in dev when it's unset/default.
function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret || secret.startsWith('change-me')) return true
  const url = new URL(req.url)
  return req.headers.get('authorization') === `Bearer ${secret}` || url.searchParams.get('key') === secret
}

export async function GET(req: Request) {
  if (!authorized(req)) return Response.json({ error: 'unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const to = url.searchParams.get('to') || process.env.SMTP_USER || ''
  const type = url.searchParams.get('type') || 'test'

  let result
  if (type === 'congrats') {
    try {
      const { dayCompleteEmail } = await import('@/lib/email/templates')
      const { subject, html } = dayCompleteEmail(
        'Founder',
        {
          week: 1,
          day: 2,
          task: 'Interview target users to validate problem segment.'
        }
      )
      result = await dispatchEmail({
        type: 'congrats',
        to,
        subject,
        html,
      })
    } catch (e: any) {
      result = { sent: false, reason: 'template_error', detail: e?.message }
    }
  } else {
    result = await dispatchEmail({
      type: 'test',
      to,
      subject: 'VEIXON · SMTP test ✓',
      html: `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#0b0b14;color:#f4f5fa;padding:28px;border-radius:14px;max-width:480px;">
        <div style="font-size:12px;letter-spacing:3px;color:#6D5DF6;text-transform:uppercase;font-weight:800;">VEIXON · VZN</div>
        <h2 style="margin:10px 0 6px;">It works.</h2>
        <p style="color:#9a9ab2;line-height:1.6;">Your mailer is live — Nodemailer + SMTP are wired correctly. The welcome, idea-report, decision, and inactivity emails will all send from here.</p>
        <p style="color:#5c5c70;font-size:12px;margin-top:16px;">Sent ${new Date().toISOString()}</p>
      </div>`,
    })
  }

  return Response.json({ to, type, ...result })
}
