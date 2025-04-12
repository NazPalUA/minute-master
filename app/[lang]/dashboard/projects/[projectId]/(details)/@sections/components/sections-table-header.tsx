import { TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dictionary } from '@/localization'

export function SectionsTableHeader({ dict }: { dict: Dictionary }) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>{dict.section.entity.singular}</TableHead>
        <TableHead>{dict.task.entity.singular}</TableHead>
        <TableHead>{dict.time.metrics.timeSpent}</TableHead>
        <TableHead className="text-right">
          {dict.common.common.actions}
        </TableHead>
      </TableRow>
    </TableHeader>
  )
}
