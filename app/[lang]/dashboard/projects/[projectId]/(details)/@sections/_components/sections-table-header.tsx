'use client'

import { TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useDictionary } from '@/hooks/use-dictionary'

export function SectionsTableHeader() {
  const { section, task, time, common } = useDictionary()

  return (
    <TableHeader>
      <TableRow>
        <TableHead>{section.entity.singular}</TableHead>
        <TableHead>{task.entity.singular}</TableHead>
        <TableHead>{time.metrics.timeSpent}</TableHead>
        <TableHead className="text-right">{common.common.actions}</TableHead>
      </TableRow>
    </TableHeader>
  )
}
