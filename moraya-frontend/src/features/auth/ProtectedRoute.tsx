import { useEffect, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { ApiError } from '@/lib/api'
import { useI18n } from '@/i18n/I18nProvider'
import { useAuth } from './AuthProvider'
import { signOut } from './authService'
import { useMe } from './useMe'

/** UI convenience only. Real protection is the Worker + Supabase RLS. */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { t } = useI18n()
  const { session, loading } = useAuth()
  const me = useMe()

  const blocked = me.error instanceof ApiError && (me.error.status === 401 || me.error.status === 403)
  useEffect(() => {
    if (blocked) void signOut()
  }, [blocked])

  if (loading) return <div className="min-h-dvh bg-surface" aria-busy="true" />
  if (!session || blocked) return <Navigate to="/login" replace />
  if (me.isPending) return <div className="min-h-dvh bg-surface" aria-busy="true" />
  if (me.isError) {
    return (
      <main className="mx-auto max-w-[520px] px-6 py-16">
        <p className="mb-4 text-danger" role="alert">
          {t('error.network')}
        </p>
        <button
          type="button"
          onClick={() => void me.refetch()}
          className="h-10 rounded-md border border-line px-4 text-sm font-semibold hover:bg-page"
        >
          {t('common.retry')}
        </button>
      </main>
    )
  }
  return <>{children}</>
}
