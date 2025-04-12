import { getPageSchema, getPageSizeSchema } from '@/lib/schemas'
import type { SearchParams } from '@/lib/types'
import { Language } from '@/localization'
import { getSectionsNames } from '@/server/data/get-sections-names'
import { getTasks } from '@/server/data/get-tasks'
import { getTimeLogs } from '@/server/data/get-time-logs'
import { LogsPagination } from './_components/logs-pagination'
import { RuntimesTable } from './_components/table'
import { TableHeader } from './_components/table-header'
import {
  SECTION_FILTER_SEARCH_PARAM_KEY,
  TASK_FILTER_SEARCH_PARAM_KEY
} from './_lib/consts'
import { LogsTableProvider } from './_lib/logs-table-context'
import { filtersSchema } from './_lib/schemas'

type Params = { lang: Language; projectId: string }

export default async function Runtimes(props: {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
}) {
  const searchParams = await props.searchParams
  const { projectId, lang } = await props.params

  const sectionFilter = searchParams[SECTION_FILTER_SEARCH_PARAM_KEY]
  const taskFilter = searchParams[TASK_FILTER_SEARCH_PARAM_KEY]

  const filters = filtersSchema.parse({
    section: sectionFilter,
    task: taskFilter
  })

  const sections = await getSectionsNames({ projectId })
  const tasks = await getTasks({
    projectId,
    sectionId: filters.section,
    getAllItems: true
  })

  const sectionId = filters.section
    ? filters.section
    : filters.task
      ? tasks.data.find(task => task.id === filters.task)?.sectionId
      : undefined

  const {
    data: runtimes,
    pagination: { totalItems, totalPages }
  } = await getTimeLogs({
    projectId,
    sectionId,
    taskId: filters.task,
    page: getPageSchema().parse(searchParams.page),
    limit: getPageSizeSchema().parse(searchParams.perPage)
  })

  const projectName = runtimes.find(
    timeLog => timeLog.projectId === projectId
  )?.projectName

  return (
    <LogsTableProvider>
      <TableHeader
        sections={sections.data}
        tasks={tasks.data}
        project={{ id: projectId, name: projectName || '' }}
      />
      <RuntimesTable runtimes={runtimes} lang={lang} />
      <LogsPagination totalItems={totalItems} totalPages={totalPages} />
    </LogsTableProvider>
  )
}
