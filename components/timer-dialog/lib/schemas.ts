import { z } from 'zod'

export const baseSchema = z.object({
  proj: z.string().optional(),
  sec: z.string().optional(),
  task: z.union([z.string(), z.literal('null')]).optional()
})

export const timerSelectorSchema = baseSchema.optional()

export type TimerSelector = z.infer<typeof timerSelectorSchema>

export const timerSelectorKeys = baseSchema.keyof()._def.values
export type TimerSelectorKeys = (typeof timerSelectorKeys)[number]
