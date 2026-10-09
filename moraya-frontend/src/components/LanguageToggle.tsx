import { useI18n } from '@/i18n/I18nProvider'
import type { Lang } from '@/i18n/messages'

const OPTIONS: { value: Lang; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'mr', label: 'मराठी' },
]

export function LanguageToggle() {
  const { lang, setLang, t } = useI18n()
  return (
    <div role="group" aria-label={t('common.language')} className="flex overflow-hidden rounded-md border border-line text-[13px]">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          lang={o.value}
          aria-pressed={lang === o.value}
          onClick={() => setLang(o.value)}
          className={
            'h-9 px-3 font-medium transition-colors ' +
            (lang === o.value ? 'bg-ink text-surface' : 'text-body hover:bg-page')
          }
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
