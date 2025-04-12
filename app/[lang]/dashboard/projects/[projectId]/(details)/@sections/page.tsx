import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table } from '@/components/ui/table'
import type { SearchParams } from '@/lib/types'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { getSectionsDetails } from '@/server/data/get-sections-details'
import { Suspense } from 'react'
import { AddSectionButton } from './components/add-section-button'
import { SectionsTableBody } from './components/sections-table-body'
import { SectionsTableBodyFallback } from './components/sections-table-body-fallback'
import { SectionsTableHeader } from './components/sections-table-header'
import { SectionsTablePagination } from './components/sections-table-pagination'

type Params = { lang: Language; projectId: string }

export default async function Details(props: {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
}) {
  const { lang, projectId } = await props.params
  const dict = await getDictionary(lang)

  const sectionsPromise = getSectionsDetails({
    projectId: projectId.toString()
  })

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>{dict.section.entity.plural}</CardTitle>
        <AddSectionButton>
          {dict.section.actions.create.trigger}
        </AddSectionButton>
      </CardHeader>
      <CardContent>
        <Table>
          <SectionsTableHeader dict={dict} />
          <Suspense fallback={<SectionsTableBodyFallback />}>
            <SectionsTableBody sectionsPromise={sectionsPromise} />
          </Suspense>
        </Table>
        <Suspense>
          <SectionsTablePagination sectionsPromise={sectionsPromise} />
        </Suspense>
      </CardContent>
    </Card>
  )
}
