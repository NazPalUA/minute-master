import { Table } from '@/components/ui/table'
import type { SearchParams } from '@/lib/types'
import { Language } from '@/localization'
import { getSectionsDetails } from '@/server/data/get-sections-details'
import { SectionsTableBody } from './components/sections-table-body'
import { SectionsTableHeader } from './components/sections-table-header'
import { SectionsTablePagination } from './components/sections-table-pagination'

type Params = { lang: Language; projectId: string }

export default async function Details(props: {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
}) {
  const { projectId } = await props.params

  const sections = await getSectionsDetails({
    projectId: projectId.toString()
  })

  return (
    <>
      <Table>
        <SectionsTableHeader />
        <SectionsTableBody sections={sections.data} />
      </Table>
      <SectionsTablePagination sections={sections.data} />
    </>
  )
}
