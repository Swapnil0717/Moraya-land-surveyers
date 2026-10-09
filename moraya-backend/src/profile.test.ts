import { describe, expect, it } from 'vitest'
import { HttpError } from './http'
import { ALL_PERMISSIONS, buildProfile, type EmployeeRow } from './profile'

const base: EmployeeRow = {
  id: 'emp-1',
  employee_code: 'E-002',
  full_name: 'Rahul Patil',
  designation: 'Surveyor',
  login_email: 'rahul@example.com',
  role: 'worker',
  status: 'active',
  user_permissions: [],
}

describe('buildProfile', () => {
  it('rejects a login with no employee record', () => {
    expect(() => buildProfile('u1', undefined)).toThrowError(HttpError)
    try {
      buildProfile('u1', undefined)
    } catch (e) {
      expect((e as HttpError).code).toBe('NO_PROFILE')
    }
  })

  it('rejects revoked and inactive accounts with distinct codes', () => {
    const code = (status: EmployeeRow['status']) => {
      try {
        buildProfile('u1', { ...base, status })
      } catch (e) {
        return (e as HttpError).code
      }
    }
    expect(code('revoked')).toBe('ACCESS_REVOKED')
    expect(code('inactive')).toBe('ACCOUNT_INACTIVE')
  })

  it('gives workers no admin permissions even if rows exist', () => {
    const p = buildProfile('u1', { ...base, user_permissions: [{ permission: 'export' }] })
    expect(p.permissions).toEqual([])
  })

  it('gives the Main Admin every permission', () => {
    expect(buildProfile('u1', { ...base, role: 'main_admin' }).permissions).toEqual([...ALL_PERMISSIONS])
  })

  it('gives a Sub-Admin only the permissions granted, ignoring unknown ones', () => {
    const p = buildProfile('u1', {
      ...base,
      role: 'sub_admin',
      user_permissions: [{ permission: 'verification' }, { permission: 'made_up' }],
    })
    expect(p.permissions).toEqual(['verification'])
  })
})
