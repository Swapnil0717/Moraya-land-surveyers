import type { Env } from './env'
import { HttpError } from './http'
import type { EmployeeRow } from './profile'

/** Server-side database access with the service-role key (bypasses RLS).
 *  Only call this AFTER authenticate() and the needed permission checks. */
export async function findEmployeeByAuthUser(env: Env, userId: string): Promise<EmployeeRow | undefined> {
  const select = 'id,employee_code,full_name,designation,login_email,role,status,user_permissions(permission)'
  const url = `${env.SUPABASE_URL}/rest/v1/employees?auth_user_id=eq.${encodeURIComponent(userId)}&select=${select}&limit=1`
  let res: Response
  try {
    res = await fetch(url, {
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    })
  } catch {
    throw new HttpError(502, 'UPSTREAM_UNAVAILABLE')
  }
  if (!res.ok) throw new HttpError(502, 'UPSTREAM_UNAVAILABLE')
  const rows = (await res.json()) as EmployeeRow[]
  return rows[0]
}
