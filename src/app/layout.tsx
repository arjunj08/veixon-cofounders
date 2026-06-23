import './globals.css'
import type { Metadata } from 'next'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'VEIXON Co-founders - Your AI Co-Founder from Day One',
  description:
    'AI-powered co-founder platform for idea analysis, 90-day execution planning, decision simulation, and founder accountability.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
