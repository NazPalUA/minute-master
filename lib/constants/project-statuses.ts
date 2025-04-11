export const PROJECT_STATUSES = {
  NOT_STARTED: 'not-started',
  IN_PROGRESS: 'in-progress',
  ON_HOLD: 'on-hold',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const

export type ProjectStatus =
  (typeof PROJECT_STATUSES)[keyof typeof PROJECT_STATUSES]

export const defaultProjectStatus = PROJECT_STATUSES.NOT_STARTED

export const projectStatuses = Object.values(PROJECT_STATUSES)
