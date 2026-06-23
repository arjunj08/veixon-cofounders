'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type ThemeMode = 'dark' | 'light'

type ThemeContextValue = {
  mode: ThemeMode
  isDark: boolean
  setTheme: (mode: ThemeMode) => void
  toggleTheme: () => void
}

const darkTheme: Record<string, string> = {
  '--bg-primary': '#0D0D0F',
  '--bg-secondary': '#141418',
  '--bg-tertiary': '#0A0A0C',
  '--border': '#2A2A35',
  '--text-primary': '#F5F5F5',
  '--text-muted': '#888888',
  '--purple': '#534AB7',
  '--purple-dim': '#2A2560',
  '--purple-light': '#EEEDFE',
  '--teal': '#0F6E56',
  '--amber': '#EF9F27',
  '--red': '#DC2626',
  '--card-bg': '#141418',
  '--card-glow': 'rgba(83, 74, 183, 0.15)',
  '--nav-bg': 'rgba(13, 13, 15, 0.85)',
  '--canvas-bg': '#0D0D0F',
  '--canvas-grid': '#2A2A35',
  '--canvas-fog': '#0D0D0F',
  '--canvas-particle': '#534AB7',
}

const lightTheme: Record<string, string> = {
  '--bg-primary': '#F8F7FF',
  '--bg-secondary': '#FFFFFF',
  '--bg-tertiary': '#F0EEF8',
  '--border': '#E2E0F0',
  '--text-primary': '#0D0D0F',
  '--text-muted': '#666666',
  '--purple': '#534AB7',
  '--purple-dim': '#2A2560',
  '--purple-light': '#EEEDFE',
  '--teal': '#0F6E56',
  '--amber': '#B07010',
  '--red': '#DC2626',
  '--card-bg': '#FFFFFF',
  '--card-glow': 'rgba(83, 74, 183, 0.10)',
  '--nav-bg': 'rgba(248, 247, 255, 0.85)',
  '--canvas-bg': '#F8F7FF',
  '--canvas-grid': '#D0CCE8',
  '--canvas-fog': '#F8F7FF',
  '--canvas-particle': '#3D35A0',
}

const STORAGE_KEY = 'visionix_theme'
const ThemeContext = createContext<ThemeContextValue | null>(null)

function applyTheme(mode: ThemeMode) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const theme = mode === 'dark' ? darkTheme : lightTheme
  Object.entries(theme).forEach(([key, value]) => root.style.setProperty(key, value))
  root.dataset.theme = mode
  root.classList.toggle('dark', mode === 'dark')
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('dark')

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    const initial = saved === 'light' ? 'light' : 'dark'
    setMode(initial)
    applyTheme(initial)
  }, [])

  const setTheme = (next: ThemeMode) => {
    setMode(next)
    window.localStorage.setItem(STORAGE_KEY, next)
    applyTheme(next)
  }

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      isDark: mode === 'dark',
      setTheme,
      toggleTheme: () => setTheme(mode === 'dark' ? 'light' : 'dark'),
    }),
    [mode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const value = useContext(ThemeContext)
  if (!value) throw new Error('useTheme must be used inside ThemeProvider')
  return value
}
