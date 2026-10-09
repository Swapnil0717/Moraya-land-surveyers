import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Logo } from '@/components/Logo'
import { LanguageToggle } from '@/components/LanguageToggle'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useI18n } from '@/i18n/I18nProvider'
import type { MessageKey } from '@/i18n/messages'
import { useAuth } from './AuthProvider'
import { useQueryClient } from '@tanstack/react-query'
import { signIn, type SignInFailure } from './authService'
import { meKey } from './useMe'
import { createLoginSchema, type LoginValues } from './loginSchema'

const REASON_KEY: Record<SignInFailure, MessageKey> = {
  invalid: 'error.invalid',
  revoked: 'error.revoked',
  inactive: 'error.inactive',
  noProfile: 'error.noProfile',
  network: 'error.network',
  config: 'error.config',
}

const inputBase =
  'h-[46px] w-full rounded-md border bg-surface px-3.5 text-[15px] text-body placeholder:text-placeholder focus:border-primary focus:outline-none focus-visible:outline-none focus:ring-1 focus:ring-primary max-[939px]:h-[52px] max-[939px]:text-base'

export function LoginPage() {
  const { t } = useI18n()
  const { session, loading } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<MessageKey | null>(null)

  const schema = useMemo(() => createLoginSchema(t), [t])
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', remember: true },
  })

  if (!loading && session && !isSubmitting) return <Navigate to="/dashboard" replace />

  const onSubmit = async (values: LoginValues) => {
    setFormError(null)
    const result = await signIn(values.email, values.password, values.remember)
    if (result.ok) {
      queryClient.setQueryData(meKey(result.me.userId), result.me)
      // Role-based routing (Admin / Sub-Admin / Worker) uses result.me.role — added with the dashboards.
      navigate('/dashboard', { replace: true })
    } else {
      setFormError(REASON_KEY[result.reason])
    }
  }

  return (
    <div className="min-h-dvh bg-surface text-body min-[940px]:grid min-[940px]:grid-cols-[5fr_6fr]">
      {/* Brand panel — laptop and up */}
      <aside className="hidden min-h-dvh flex-col items-start bg-panel px-10 py-9 text-panel-text min-[940px]:flex">
        <Logo onDark className="mt-1.5 aspect-[325.6/357.1] h-auto w-[210px]" />
        <div className="mt-auto w-full border-t-[3px] border-primary pt-[22px]">
          <h2 className="mb-3.5 max-w-[21ch] text-[21px] font-semibold leading-[1.3]">
            {t('login.brandHeadline')}
          </h2>
          <ul className="mb-[26px] list-none p-0 text-sm text-panel-muted">
            {(['login.brand1', 'login.brand2', 'login.brand3'] as const).map((k) => (
              <li key={k} className="border-t border-panel-line py-[7px]">
                {t(k)}
              </li>
            ))}
          </ul>
          <small className="text-xs text-panel-muted">{t('common.copyright')}</small>
        </div>
      </aside>

      {/* Form side */}
      <main className="flex min-h-dvh flex-col px-7">
        <div className="flex items-center justify-end gap-2 pt-5">
          <LanguageToggle />
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-[380px]">
            <Logo className="mb-7 aspect-[325.6/357.1] h-auto w-[118px] min-[940px]:hidden" />

            <h1 className="mb-1.5 text-[23px] font-semibold tracking-[-0.2px]">{t('login.title')}</h1>
            <p className="mb-6 text-sm text-muted">{t('login.subtitle')}</p>

            {formError && (
              <div
                role="alert"
                className="mb-[18px] rounded-md border border-danger px-3.5 py-2.5 text-sm text-danger bg-danger-bg"
              >
                {t(formError)}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="mb-[18px]">
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                  {t('login.email')}
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  inputMode="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder={t('login.emailPlaceholder')}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={inputBase + (errors.email ? ' border-danger' : ' border-line')}
                  {...register('email')}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1.5 text-[13px] text-danger">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="mb-[18px]">
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                  {t('login.password')}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder={t('login.passwordPlaceholder')}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    className={inputBase + ' pr-[76px]' + (errors.password ? ' border-danger' : ' border-line')}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                    className="absolute bottom-1 right-1 top-1 rounded px-3 text-[13px] font-semibold text-primary"
                  >
                    {showPassword ? t('login.hide') : t('login.show')}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-1.5 text-[13px] text-danger">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="mb-[22px] mt-0.5 text-sm">
                <label className="flex cursor-pointer items-center gap-2 font-normal">
                  <input type="checkbox" className="h-4 w-4 accent-[var(--primary)]" {...register('remember')} />
                  {t('login.keep')}
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-md bg-primary font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70 max-[939px]:h-[54px] max-[939px]:text-base"
              >
                {isSubmitting ? t('login.submitting') : t('login.submit')}
              </button>
            </form>

            <p className="mt-[22px] border-t border-line pt-4 text-[13px] text-muted">{t('login.help')}</p>
          </div>
        </div>

        <p className="pb-5 text-center text-xs text-muted min-[940px]:hidden">{t('common.copyright')}</p>
      </main>
    </div>
  )
}
