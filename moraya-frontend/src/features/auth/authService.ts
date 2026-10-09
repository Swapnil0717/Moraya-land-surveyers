import { ApiError, fetchMe, type Profile } from '@/lib/api'
import { setRemember, supabase } from '@/lib/supabase'

export type SignInFailure = 'invalid' | 'revoked' | 'inactive' | 'noProfile' | 'network' | 'config'
export type SignInResult = { ok: true; me: Profile } | { ok: false; reason: SignInFailure }

const API_REASON: Record<string, SignInFailure> = {
  ACCOUNT_INACTIVE: 'inactive',
  ACCESS_REVOKED: 'revoked',
  NO_PROFILE: 'noProfile',
}

/**
 * Step 1: Supabase Auth checks email + password.
 * Step 2: our Worker (/api/me) checks the account is Active and returns role + permissions.
 * If step 2 fails, the Supabase session is closed again, so a blocked user never stays signed in.
 */
export async function signIn(email: string, password: string, remember: boolean): Promise<SignInResult> {
  if (!supabase) return { ok: false, reason: 'config' }
  setRemember(remember)
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error || !data.session) {
      if (error?.code === 'user_banned') return { ok: false, reason: 'revoked' }
      if (error?.code === 'invalid_credentials' || error?.status === 400) return { ok: false, reason: 'invalid' }
      return { ok: false, reason: 'network' }
    }
    try {
      const me = await fetchMe(data.session.access_token)
      return { ok: true, me }
    } catch (e) {
      await supabase.auth.signOut()
      const reason = e instanceof ApiError ? (API_REASON[e.code] ?? 'network') : 'network'
      return { ok: false, reason }
    }
  } catch {
    return { ok: false, reason: 'network' }
  }
}

export async function signOut() {
  await supabase?.auth.signOut()
}
