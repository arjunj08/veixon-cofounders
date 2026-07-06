import type { Session } from 'next-auth'
import { dispatchEmail } from '@/lib/email/service'
import { dayOneCompleteEmail, dayCompleteEmail } from '@/lib/email/templates'

const isEmail = (value?: string | null): value is string => !!value && /.+@.+\..+/.test(value)

export async function sendDayOneCompletionEmail(args: {
  startup: any
  session?: Session | null
  taskId?: string | null
  week?: number | string | null
  day?: number | string | null
  task?: string | null
}) {
  const isDayOne = args.taskId === 'wk1-day1' || (Number(args.week) === 1 && Number(args.day) === 1)
  if (!isDayOne) return { sent: false, reason: 'not day 1' }

  const sessionUser = args.session?.user as any
  const to =
    sessionUser?.email ||
    args.startup?.founderEmail ||
    (isEmail(args.startup?.userId) ? args.startup.userId : null)

  if (!to) return { sent: false, reason: 'no recipient' }

  const name = sessionUser?.name || String(to).split('@')[0] || 'Founder'
  const { subject, html } = dayOneCompleteEmail(name, { task: args.task || undefined })

  return dispatchEmail({
    type: 'day_1_complete',
    to,
    userId: args.startup?.userId,
    refId: `${args.startup?.id}:wk1-day1`,
    subject,
    html,
    once: true,
  })
}

export async function sendDailyCheckinEmail(args: {
  startup: any
  session?: Session | null
  week: number
  day: number
  task?: string | null
}) {
  const sessionUser = args.session?.user as any
  const to =
    sessionUser?.email ||
    args.startup?.founderEmail ||
    (isEmail(args.startup?.userId) ? args.startup.userId : null)

  if (!to) return { sent: false, reason: 'no recipient' }

  const name = sessionUser?.name || String(to).split('@')[0] || 'Founder'
  const { subject, html } = dayCompleteEmail(name, { 
    week: Number(args.week), 
    day: Number(args.day), 
    task: args.task || undefined 
  })

  return dispatchEmail({
    type: 'daily_checkin_complete',
    to,
    userId: args.startup?.userId,
    refId: `${args.startup?.id}:wk${args.week}-day${args.day}`,
    subject,
    html,
    once: true,
  })
}
