'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/app/context/ThemeContext'
import CustomCursor from '@/components/ui/CustomCursor'
import EmergencyRunwayBanner from '@/components/ui/EmergencyRunwayBanner'
import VZNChat from '@/components/VZNChat'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <CustomCursor />
        <EmergencyRunwayBanner />
        {children}
        <VZNChat />
      </ThemeProvider>
    </SessionProvider>
  )
}
