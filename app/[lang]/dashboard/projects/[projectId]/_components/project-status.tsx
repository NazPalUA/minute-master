'use client'

import { StatusBadge } from '@/components/status-badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useDictionary } from '@/hooks'
import {
  type ProjectStatus as ProjectStatusType,
  projectStatuses
} from '@/lib/constants/project-statuses'
import { updateProjectStatus } from '@/server/actions/update-project-status'
import { GetProjectInfoReturn } from '@/server/data/get-project-info'
import { ChevronDownIcon, Loader2 } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { use } from 'react'
import { toast } from 'sonner'

export function ProjectStatus({
  projectInfoPromise,
  projectId
}: {
  projectInfoPromise: Promise<GetProjectInfoReturn>
  projectId: string
}) {
  const { status } = use(projectInfoPromise)
  const { project: projectDict, common: commonDict } = useDictionary()

  const { execute, isPending } = useAction(updateProjectStatus, {
    onSuccess: () => {
      toast.success(projectDict.actions.update.success)
    },
    onError: () => {
      toast.error(projectDict.actions.update.failure)
    }
  })

  const handleStatusChange = (newStatus: ProjectStatusType) => {
    execute({
      query: {
        projectId: projectId
      },
      payload: {
        status: newStatus
      }
    })
  }

  return (
    <Select
      value={status}
      onValueChange={handleStatusChange}
      disabled={isPending}
    >
      <StatusBadge
        asChild
        status={status}
        dict={commonDict}
        className="w-[180px] cursor-pointer px-3 py-1 text-lg"
      >
        <SelectTrigger showChevron={false}>
          <SelectValue className="flex items-center gap-2">
            {commonDict.statuses[status]}
            {isPending ? (
              <Loader2 className="mt-1 size-4 animate-spin opacity-50" />
            ) : (
              <ChevronDownIcon className="mt-1 size-6 opacity-50" />
            )}
          </SelectValue>
        </SelectTrigger>
      </StatusBadge>

      <SelectContent>
        {projectStatuses.map(statusOption => (
          <SelectItem key={statusOption} value={statusOption}>
            <StatusBadge status={statusOption} dict={commonDict} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function ProjectStatusSkeleton() {
  return (
    <div className="w-[180px]">
      <Skeleton className="h-9 w-full rounded-full" />
    </div>
  )
}
