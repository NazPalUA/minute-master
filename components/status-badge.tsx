import { Badge } from '@/components/ui/badge'
import { TASK_STATUSES, TaskStatus } from '@/lib/constants'
import {
  PROJECT_STATUSES,
  type ProjectStatus as ProjectStatusType
} from '@/lib/constants/project-statuses'
import { Dictionary } from '@/localization'

export function StatusBadge({
  status,
  dict,
  children,
  ...props
}: {
  status: ProjectStatusType | TaskStatus
  dict: Dictionary['common']
  children?: React.ReactNode
} & React.ComponentProps<typeof Badge>) {
  return (
    <Badge variant={getStatusVariant(status)} {...props}>
      {children || dict.statuses[status]}
    </Badge>
  )
}

const getStatusVariant = (status: ProjectStatusType | TaskStatus) => {
  switch (status.toLowerCase()) {
    case PROJECT_STATUSES.COMPLETED || TASK_STATUSES.COMPLETED:
      return 'default'
    case PROJECT_STATUSES.IN_PROGRESS || TASK_STATUSES.IN_PROGRESS:
      return 'secondary'
    case PROJECT_STATUSES.ON_HOLD ||
      TASK_STATUSES.ON_HOLD ||
      PROJECT_STATUSES.CANCELLED:
      return 'destructive'
    default:
      return 'outline'
  }
}
