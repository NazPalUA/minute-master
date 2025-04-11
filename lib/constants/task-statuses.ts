export const TASK_STATUSES = {
  NOT_STARTED: 'not-started',
  IN_PROGRESS: 'in-progress',
  ON_HOLD: 'on-hold',
  COMPLETED: 'completed'
} as const

export type TaskStatus = (typeof TASK_STATUSES)[keyof typeof TASK_STATUSES]

export const defaultTaskStatus = TASK_STATUSES.NOT_STARTED

export const taskStatuses = Object.values(TASK_STATUSES)
