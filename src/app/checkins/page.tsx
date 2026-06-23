import { redirect } from 'next/navigation'

export default function CheckinsRedirect() {
  redirect('/dashboard#checkins')
}
