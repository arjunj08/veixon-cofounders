'use client'

const STORAGE_KEY = 'visionix_uid'
const STARTUP_KEY = 'visionix_startup_id'

export function getStoredUserId() {
  if (typeof window === 'undefined') return 'anonymous'
  return localStorage.getItem(STORAGE_KEY) || 'anonymous'
}

export function ensureUserId(sessionEmail) {
  if (typeof window === 'undefined') return sessionEmail || 'anonymous'
  if (sessionEmail) {
    localStorage.setItem(STORAGE_KEY, sessionEmail)
    return sessionEmail
  }
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, 'u_' + Math.random().toString(36).slice(2, 12))
  }
  return localStorage.getItem(STORAGE_KEY)
}

export function setActiveStartupId(id) {
  if (typeof window !== 'undefined' && id) {
    localStorage.setItem(STARTUP_KEY, id)
  }
}

export function getActiveStartupId() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(STARTUP_KEY)
}
