import { TASK_STATUSES } from '@/lib/constants/task-statuses'
import {
  ClerkUserIdSchema,
  ClientProvidedDateSchema,
  CreatedAtSchema,
  ObjectIdSchema,
  UpdatedAtSchema
} from '@/server/db/common-schemas'
import { z } from 'zod'

export type TaskEntity = z.infer<typeof TaskEntitySchema>
export type TaskInput = z.input<typeof TaskEntitySchema>

export const TaskEntitySchema = z.object({
  _id: ObjectIdSchema.optional(),
  userId: ClerkUserIdSchema,
  projectId: ObjectIdSchema,
  sectionId: ObjectIdSchema,

  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  status: z
    .nativeEnum(TASK_STATUSES)
    .default(TASK_STATUSES.NOT_STARTED)
    .describe('Current task status'),

  startDate: ClientProvidedDateSchema.optional().describe(
    'Task start date (optional)'
  ),
  dueDate: ClientProvidedDateSchema.optional().describe(
    'Task target completion date (optional)'
  ),
  completedDate: ClientProvidedDateSchema.optional().describe(
    'Actual completion date (optional)'
  ),
  estimatedTime: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe('Estimated time in milliseconds'),

  // Server-managed dates
  createdAt: CreatedAtSchema,
  updatedAt: UpdatedAtSchema
})
