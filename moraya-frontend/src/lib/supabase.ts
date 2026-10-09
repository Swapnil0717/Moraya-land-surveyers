import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const REMEMBER_KEY = 'moraya.remember'

/** "Keep me signed in" ON  -> session in localStorage (survives browser restart).
 *  "Keep me signed in" OFF -> session in sessionStorage (ends when the tab closes). */
export function setRemember(remember: boolean) {
  try {
    localStorage.setItem(REMEMBER_KEY, remember ? '1' : '0')
  } catch {
    /* storage unavailable */
  }
}

const sessionStorageAdapter = {
  getItem(key: string) {
    return localStorage.getItem(key) ?? sessionStorage.getItem(key)
  },
  setItem(key: string, value: string) {
    const remember = localStorage.getItem(REMEMBER_KEY) !== '0'
    ;(remember ? localStorage : sessionStorage).setItem(key, value)
    ;(remember ? sessionStorage : localStorage).removeItem(key)
  },
  removeItem(key: string) {
    localStorage.removeItem(key)
    sessionStorage.removeItem(key)
  },
}

/** Only the public anon key is used here. The service-role key must never reach the browser. */
export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
          storage: sessionStorageAdapter,
        },
      })
    : null
