'use client'

import { QueryStateSelector } from '@/components/query-state-selector'
import { TimeLogDialog } from '@/components/time-log-dialog'
import { Button } from '@/components/ui/button'
import { useDictionary } from '@/hooks'
import { GetSectionsNamesReturn } from '@/server/data/get-sections-names'
import { GetTasksNamesReturn } from '@/server/data/get-tasks-names'
import { PlusIcon } from 'lucide-react'
import { use } from 'react'
import {
  SECTION_FILTER_SEARCH_PARAM_KEY,
  TASK_FILTER_SEARCH_PARAM_KEY
} from '../_lib/consts'
import { LogsTableContext } from '../_lib/logs-table-context'

type Props = {
  sections: GetSectionsNamesReturn['data']
  tasks: GetTasksNamesReturn['data']
  project: { id: string; name: string }
}

export function TableHeader(props: Props) {
  const { sections, tasks, project } = props

  const { common: commonDict, 'time-log': timeLogDict } = useDictionary()
  const { sectionFilter, taskFilter } = use(LogsTableContext)

  return (
    <div className="mb-4 flex flex-row justify-between">
      <div className="flex gap-2">
        <QueryStateSelector
          transitionReturn={[
            sectionFilter.isPending,
            sectionFilter.startTransition
          ]}
          placeholder={commonDict.filters.bySection.label}
          searchParamsKey={SECTION_FILTER_SEARCH_PARAM_KEY}
          defaultValue="all"
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

        <QueryStateSelector
          transitionReturn={[taskFilter.isPending, taskFilter.startTransition]}
          placeholder={commonDict.filters.byTask.label}
          searchParamsKey={TASK_FILTER_SEARCH_PARAM_KEY}
          defaultValue="all"
          items={[
            {
              label: commonDict.common.all,
              value: 'all'
            },
            {
              label: commonDict.common.none,
              value: 'none'
            },
            ...tasks.map(task => ({
              label: task.name,
              value: task.id
            }))
          ]}
        />
      </div>

      <TimeLogDialog project={project}>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          {timeLogDict.actions.create.trigger}
        </Button>
      </TimeLogDialog>
    </div>
  )
}
