import type { Dictionary } from '@/localization'
import { z } from 'zod'

export const itemSchema = (dict: Dictionary['common']['validation']) =>
  z.object({
    startDate: z.coerce.date({
      required_error: dict.required
    }),
    endDate: z.coerce.date({
      required_error: dict.required
    })
  })

export const importSchema = (dict: Dictionary['common']['validation']) =>
  z.array(itemSchema(dict))

export type ImportSchema = z.infer<ReturnType<typeof importSchema>>
