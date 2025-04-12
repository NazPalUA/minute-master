import { getPageSchema, getPageSizeSchema } from '@/lib/schemas'
import type { SearchParams } from '@/lib/types'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { getSectionsNames } from '@/server/data/get-sections-names'
import { getTasks } from '@/server/data/get-tasks'
import { TableHeader } from './_components/table-header'
import { TasksPagination } from './_components/tasks-pagination'
import { TasksTable } from './_components/tasks-table'
import { filtersSchema } from './_lib/filters-schema'
import { TasksTableProvider } from './_lib/tasks-table-context'

type Params = { lang: Language; projectId: string }

const sectionFilterSPKey = 'project-tasks-section-filter' as const
const statusFilterSPKey = 'project-tasks-status-filter' as const

export default async function Tasks(props: {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
}) {
  const { lang, projectId } = await props.params
  const searchParams = await props.searchParams

  const { common: commonDict } = await getDictionary(lang)

  const sectionFilter = searchParams[sectionFilterSPKey]
  const statusFilter = searchParams[statusFilterSPKey]

  const filters = filtersSchema.parse({
    sectionFilter,
    statusFilter
  })

  const { data: sections } = await getSectionsNames({ projectId })

  const includeStatuses =
    filters.statusFilter === 'all' ? undefined : [filters.statusFilter]

  const {
    data: tasks,
    pagination: { totalItems, totalPages }
  } = await getTasks({
    projectId,
    sectionId:
      filters.sectionFilter === 'all' ? undefined : filters.sectionFilter,
    includeStatuses,
    page: getPageSchema().parse(searchParams.page),
    limit: getPageSizeSchema().parse(searchParams.perPage)
  })

  const tasksWithStatuses = tasks.map(task => ({
    ...task,
    statusLabel: commonDict.statuses[task.status]
  }))

  return (
    <TasksTableProvider>
      <TableHeader
        sections={sections}
        statusFilterSPKey={statusFilterSPKey}
        sectionFilterSPKey={sectionFilterSPKey}
      />
      <TasksTable tasks={tasksWithStatuses} />
      <TasksPagination totalItems={totalItems} totalPages={totalPages} />
    </TasksTableProvider>
  )
}
