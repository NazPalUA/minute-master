import type { Dictionary } from '@/localization'
import { z } from 'zod'

export const formSchema = (dict: Dictionary['common']['validation']) =>
  z.object({
    projectId: z.string({
      required_error: dict.required
    }),
    sectionId: z.string().optional(),
    taskId: z.string().optional()
  })

export type FormValues = z.infer<ReturnType<typeof formSchema>>
