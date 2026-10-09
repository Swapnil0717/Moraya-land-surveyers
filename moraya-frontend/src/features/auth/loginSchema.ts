import { z } from 'zod'
import type { MessageKey } from '@/i18n/messages'

export function createLoginSchema(t: (key: MessageKey) => string) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, t('error.emailRequired'))
      .email(t('error.emailInvalid')),
    password: z.string().min(1, t('error.passwordRequired')),
    remember: z.boolean(),
  })
}

export type LoginValues = z.infer<ReturnType<typeof createLoginSchema>>
