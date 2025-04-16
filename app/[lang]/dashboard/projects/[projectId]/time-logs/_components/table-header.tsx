'use client'

import { QueryStateSelector } from '@/components/query-state-selector'
import { TimeLogDialog } from '@/components/time-log-dialog'
import { Button } from '@/components/ui/button'
import { useDictionary } from '@/hooks'
import { GetSectionsNamesReturn } from '@/server/data/get-sections-names'
import { GetTasksNamesReturn } from '@/server/data/get-tasks-names'
import { FileDown, Import, PlusIcon } from 'lucide-react'
import { use } from 'react'
import { DialogImportTimeLogs } from '../_components/dialog-import-time-logs'
import {
  SECTION_FILTER_SEARCH_PARAM_KEY,
  TASK_FILTER_SEARCH_PARAM_KEY
} from '../_lib/consts'
import { LogsTableContext } from '../_lib/logs-table-context'
import { DialogExportTimeLogs } from './dialog-export-time-logs'
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

      <div className="flex gap-2">
        <TimeLogDialog project={project}>
          <Button variant="secondary" size="sm">
            <PlusIcon className="mr-1 size-4" />
            {timeLogDict.actions.create.trigger}
          </Button>
        </TimeLogDialog>

        <DialogImportTimeLogs project={project}>
          <Button variant="outline" size="sm">
            <Import className="mr-1 size-4" />
            {timeLogDict.actions.import.trigger}
          </Button>
        </DialogImportTimeLogs>

        <DialogExportTimeLogs project={project}>
          <Button variant="outline" size="sm">
            <FileDown className="mr-1 size-4" />
            {timeLogDict.actions.export.trigger}
          </Button>
        </DialogExportTimeLogs>
      </div>
    </div>
  )
}
