import type { Dictionary } from '@/localization'
import { z } from 'zod'

export const formSchema = (dict: Dictionary['common']['validation']) =>
  z.object({
    projectId: z.string({
      required_error: dict.required
    }),
    sectionId: z.string({
      required_error: dict.required
    }),
    taskId: z.string().optional(),
    startDate: z.date({
      required_error: dict.required
    }),
    endDate: z.date()
  })

export type FormValues = z.infer<ReturnType<typeof formSchema>>
