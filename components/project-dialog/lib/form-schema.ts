'use client'

import type { Dictionary } from '@/localization'
import { z } from 'zod'

export const formSchema = (dict: Dictionary['common']['validation']) => {
  return z.object({
    name: z
      .string()
      .min(1, dict.required)
      .min(2, dict.minLength.replace('{min}', '2'))
      .max(100, dict.maxLength.replace('{max}', '100')),

    description: z
      .string()
      .max(500, dict.maxLength.replace('{max}', '500'))
      .optional(),

    dueDate: z.date().optional(),

    estimatedTime: z.coerce
      .number()
      .min(0, dict.minValue.replace('{min}', '0'))
      .optional()
  })
}

export type FormValues = z.infer<ReturnType<typeof formSchema>>
