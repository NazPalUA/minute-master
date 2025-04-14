import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Pencil } from 'lucide-react'

export function SectionsTableBodyFallback() {
  return (
    <TableBody>
      {[...Array(3)].map((_, index) => (
        <TableRow key={index}>
          <TableCell className="font-medium">
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-10" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-15" />
          </TableCell>
          <TableCell className="text-right">
            <Button variant="ghost" size="sm" disabled>
              <Pencil className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  )
}
