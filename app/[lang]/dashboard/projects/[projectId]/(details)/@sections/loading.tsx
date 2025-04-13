import { Table } from '@/components/ui/table'
import { SectionsTableBodyFallback } from './components/sections-table-body-fallback'
import { SectionsTableHeader } from './components/sections-table-header'

export default async function Loading() {
  return (
    <Table>
      <SectionsTableHeader />
      <SectionsTableBodyFallback />
    </Table>
  )
}
