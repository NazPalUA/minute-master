import { StringObjectIdSchema } from '@/server/db/common-schemas'
import { ProjectEntitySchema } from '@/server/db/repos/projects'
import { SectionEntitySchema } from '@/server/db/repos/sections'
import { TaskEntitySchema } from '@/server/db/repos/tasks'
import { TimeLogEntitySchema } from '@/server/db/repos/time-logs'
import { z } from 'zod'

export const returnSchema = z
  .object({
    timeLog: z
      .object({
        _id: StringObjectIdSchema,
        startDate: TimeLogEntitySchema.shape.startDate.transform(date =>
          date.toISOString()
        )
      })
      .transform(({ _id, ...rest }) => ({ timeLogId: _id, ...rest })),

    project: z
      .object({
        _id: StringObjectIdSchema,
        name: ProjectEntitySchema.shape.name
      })
      .transform(({ _id, ...rest }) => ({ projectId: _id, ...rest })),

    section: z
      .object({
        _id: StringObjectIdSchema,
        name: SectionEntitySchema.shape.name
      })
      .transform(({ _id, ...rest }) => ({ sectionId: _id, ...rest })),

    task: z
      .object({
        _id: StringObjectIdSchema,
        name: TaskEntitySchema.shape.name
      })
      .transform(({ _id, ...rest }) => ({ taskId: _id, ...rest }))
      .nullable()
  })
  .nullable()

export type ReturnSchemaInput = z.input<typeof returnSchema>
export type GetRunningTimerReturn = z.output<typeof returnSchema>
