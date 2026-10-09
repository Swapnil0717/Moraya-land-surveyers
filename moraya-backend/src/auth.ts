import type { Env } from './env'
import { HttpError } from './http'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function assertConfigured(env: Env) {
  const bad = (v: string | undefined) => !v || v.startsWith('YOUR-')
  if (bad(env.SUPABASE_URL) || bad(env.SUPABASE_ANON_KEY) || bad(env.SUPABASE_SERVICE_ROLE_KEY)) {
    throw new HttpError(500, 'SERVER_NOT_CONFIGURED')
  }
}

/** Verifies the Supabase access token by asking Supabase Auth. The identity comes from the
 *  verified token, never from anything else the browser sends. */
export async function authenticate(request: Request, env: Env): Promise<{ userId: string }> {
  assertConfigured(env)
  const header = request.headers.get('authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : ''
  if (!token) throw new HttpError(401, 'UNAUTHENTICATED')

  let res: Response
  try {
    res = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: env.SUPABASE_ANON_KEY, authorization: `Bearer ${token}` },
    })
  } catch {
    throw new HttpError(502, 'UPSTREAM_UNAVAILABLE')
  }
  if (res.status === 401 || res.status === 403) throw new HttpError(401, 'UNAUTHENTICATED')
  if (!res.ok) throw new HttpError(502, 'UPSTREAM_UNAVAILABLE')

  const user = (await res.json()) as { id?: string }
  if (!user.id || !UUID.test(user.id)) throw new HttpError(401, 'UNAUTHENTICATED')
  return { userId: user.id }
}
