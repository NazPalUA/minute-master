import { Table } from '@/components/ui/table'
import { SectionsTableBodyFallback } from './_components/sections-table-body-fallback'
import { SectionsTableHeader } from './_components/sections-table-header'

export default async function Loading() {
  return (
    <Table>
      <SectionsTableHeader />
      <SectionsTableBodyFallback />
    </Table>
  )
}
