import { supabase } from './supabase'

// Empty in local dev (Vite proxies /api to the backend). Set VITE_API_URL in production.
const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')

export type Role = 'main_admin' | 'sub_admin' | 'worker'

export interface Profile {
  userId: string
  employeeId: string
  employeeCode: string
  name: string
  email: string
  designation: string | null
  role: Role
  permissions: string[]
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code)
  }
}

async function request<T>(path: string, accessToken?: string): Promise<T> {
  let token = accessToken
  if (!token) {
    const { data } = (await supabase?.auth.getSession()) ?? { data: { session: null } }
    token = data.session?.access_token
  }
  let res: Response
  try {
    res = await fetch(API_BASE + path, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
  } catch {
    throw new ApiError(0, 'NETWORK')
  }
  let body: unknown = null
  try {
    body = await res.json()
  } catch {
    /* non-JSON response */
  }
  if (!res.ok) {
    const code = (body as { error?: string } | null)?.error ?? 'SERVER_ERROR'
    throw new ApiError(res.status, code)
  }
  return body as T
}

/** The backend decides who you are (role, permissions, status). */
export const fetchMe = (accessToken?: string) => request<Profile>('/api/me', accessToken)
