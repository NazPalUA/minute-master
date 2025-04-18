'use client'

import { AlertDialogDeleteEntity } from '@/components/alert-dialog-delete-entity'
import { NotFount } from '@/components/not-fount'
import { TimeLogDialog } from '@/components/time-log-dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useDictionary } from '@/hooks'
import { cn, createDateFormatter, formatDuration } from '@/lib/utils'
import { Language } from '@/localization'
import { GetTimeLogsReturn } from '@/server/data/get-time-logs'
import { PencilIcon } from 'lucide-react'
import { use } from 'react'
import { LogsTableContext } from '../_lib/logs-table-context'
import { useDeleteTimeLogAction } from '../_lib/use-delete-time-log-action'

type Props = {
  runtimes: GetTimeLogsReturn['data']
  lang: Language
}

export function RuntimesTable(props: Props) {
  const { runtimes, lang } = props
  const {
    common: commonDict,
    'time-log': timeLogDict,
    time: timeDict
  } = useDictionary()
  const formatDate = createDateFormatter(lang)
  const { isPending } = use(LogsTableContext)

  const { execute: executeDelete, optimisticState: optimisticRuntimes } =
    useDeleteTimeLogAction(runtimes)

  if (optimisticRuntimes.length === 0) {
    return (
      <NotFount
        title={timeLogDict.emptyState.title}
        description={timeLogDict.emptyState.description}
      />
    )
  }

  return (
    <Table className={cn({ 'opacity-30': isPending })}>
      <TableHeader>
        <TableRow>
          <TableHead>{timeLogDict.fields.startDate.label}</TableHead>
          <TableHead>{timeLogDict.fields.endDate.label}</TableHead>
          <TableHead>{timeDict.common.duration}</TableHead>
          <TableHead>{timeLogDict.fields.task.label}</TableHead>
          <TableHead>{timeLogDict.fields.section.label}</TableHead>
          <TableHead>{timeLogDict.fields.project.label}</TableHead>
          <TableHead className="text-right">
            {commonDict.common.actions}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {optimisticRuntimes.map(runtime => (
          <TableRow key={runtime.id}>
            <TableCell>{formatDate(new Date(runtime.start), 'PPpp')}</TableCell>
            <TableCell>
              {runtime.end ? formatDate(new Date(runtime.end), 'PPpp') : ''}
            </TableCell>
            <TableCell>
              {formatDuration(runtime.duration, timeDict.units)}
            </TableCell>
            <TableCell>{runtime.taskName}</TableCell>
            <TableCell>{runtime.sectionName}</TableCell>
            <TableCell>{runtime.projectName}</TableCell>
            <TableCell className="flex items-center justify-end gap-2">
              <TimeLogDialog timeLog={runtime}>
                <Button variant="secondary" size="icon">
                  <PencilIcon className="size-4" />
                </Button>
              </TimeLogDialog>
              <AlertDialogDeleteEntity
                onConfirmAction={() => executeDelete({ timeLogId: runtime.id })}
                entity="time-log"
              />
            </TableCell>
          </TableRow>
        ))}
        {new Array(runtimes.length - optimisticRuntimes.length)
          .fill(null)
          .map((_, index) => (
            <TableRow key={index}>
              {new Array(7).fill(null).map((_, index) => (
                <TableCell key={index}>
                  <Skeleton className="my-2 h-5 w-32 max-w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}
