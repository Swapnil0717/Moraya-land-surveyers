import { HttpError } from './http'

export type Role = 'main_admin' | 'sub_admin' | 'worker'
export type AccountStatus = 'active' | 'inactive' | 'revoked'

export const ALL_PERMISSIONS = [
  'employee_management',
  'site_management',
  'verification',
  'income_management',
  'salary_management',
  'report_view',
  'export',
] as const

export interface EmployeeRow {
  id: string
  employee_code: string
  full_name: string
  designation: string | null
  login_email: string
  role: Role
  status: AccountStatus
  user_permissions: { permission: string }[] | null
}

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

/** Turns a database row into the profile the browser receives. Rejects non-active accounts.
 *  Aadhaar and salary are never part of this response. */
export function buildProfile(userId: string, row: EmployeeRow | undefined): Profile {
  if (!row) throw new HttpError(403, 'NO_PROFILE')
  if (row.status === 'revoked') throw new HttpError(403, 'ACCESS_REVOKED')
  if (row.status !== 'active') throw new HttpError(403, 'ACCOUNT_INACTIVE')

  const stored = (row.user_permissions ?? []).map((p) => p.permission)
  const permissions =
    row.role === 'main_admin'
      ? [...ALL_PERMISSIONS]
      : row.role === 'sub_admin'
        ? ALL_PERMISSIONS.filter((p) => stored.includes(p))
        : []

  return {
    userId,
    employeeId: row.id,
    employeeCode: row.employee_code,
    name: row.full_name,
    email: row.login_email,
    designation: row.designation,
    role: row.role,
    permissions,
  }
}
