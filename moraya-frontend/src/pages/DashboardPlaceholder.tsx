import { useNavigate } from 'react-router-dom'
import { useI18n } from '@/i18n/I18nProvider'
import { signOut } from '@/features/auth/authService'
import { useMe } from '@/features/auth/useMe'

/** Temporary landing page so you can confirm login works. Replace in the next step. */
export function DashboardPlaceholder() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { data: me } = useMe()
  return (
    <main className="mx-auto max-w-[520px] px-6 py-16">
      <h1 className="mb-2 text-2xl font-semibold">{t('dash.title')}</h1>
      <p className="mb-1 text-muted">{t('dash.body')}</p>
      {me && (
        <p className="mb-6 text-sm">
          {t('dash.signedInAs')} <strong>{me.name}</strong> · {t(`role.${me.role}`)}
        </p>
      )}
      <button
        type="button"
        onClick={async () => {
          await signOut()
          navigate('/login', { replace: true })
        }}
        className="h-10 rounded-md border border-line px-4 text-sm font-semibold hover:bg-page"
      >
        {t('dash.signOut')}
      </button>
    </main>
  )
}
