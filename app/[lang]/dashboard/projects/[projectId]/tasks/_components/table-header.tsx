'use client'

import { QueryStateSelector } from '@/components/query-state-selector'
import { TaskDialog } from '@/components/task-dialog'
import { Button } from '@/components/ui/button'
import { useDictionary } from '@/hooks'
import { taskStatuses } from '@/lib/constants'
import { PlusIcon } from 'lucide-react'
import { use } from 'react'
import { defaultFilters } from '../_lib/filters-schema'
import { TasksTableContext } from '../_lib/tasks-table-context'

type Section = {
  id: string
  name: string
}

type Props = {
  sections: Section[]
  statusFilterSPKey: string
  sectionFilterSPKey: string
}

export function TableHeader(props: Props) {
  const { sections, statusFilterSPKey, sectionFilterSPKey } = props

  const { common: commonDict, task: taskDict } = useDictionary()
  const { sectionFilter, statusFilter } = use(TasksTableContext)

  return (
    <div className="mb-4 flex flex-row justify-between">
      <div className="flex gap-2">
        <QueryStateSelector
          transitionReturn={[
            statusFilter.isPending,
            statusFilter.startTransition
          ]}
          placeholder={commonDict.filters.byStatus.label}
          searchParamsKey={statusFilterSPKey}
          defaultValue={defaultFilters.statusFilter}
          items={[
            {
              label: commonDict.common.all,
              value: 'all'
            },
            ...taskStatuses.map(status => ({
              label: commonDict.statuses[status],
              value: status
            }))
          ]}
        />

        <QueryStateSelector
          transitionReturn={[
            sectionFilter.isPending,
            sectionFilter.startTransition
          ]}
          placeholder={commonDict.filters.bySection.label}
          searchParamsKey={sectionFilterSPKey}
          defaultValue={defaultFilters.sectionFilter}
          items={[
            {
              label: commonDict.common.all,
              value: 'all'
            },
            ...sections.map(section => ({
              label: section.name,
              value: section.id
            }))
          ]}
        />
      </div>
      <TaskDialog>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          {taskDict.actions.create.title}
        </Button>
      </TaskDialog>
    </div>
  )
}
