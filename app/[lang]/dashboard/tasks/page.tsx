import { NotFount } from '@/components/not-fount'
import { getPageSchema, getPageSizeSchema } from '@/lib/schemas'
import { SearchParams } from '@/lib/types'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { getTasks } from '@/server/data/get-tasks'
import { GridCard } from './_components/grid-card'
import { TasksContainer } from './_components/tasks-container'
import { TasksPagination } from './_components/tasks-pagination'

type Params = Promise<{ lang: Language }>

export default async function Tasks(props: {
  params: Params
  searchParams: Promise<SearchParams>
}) {
  const { lang } = await props.params
  const searchParams = await props.searchParams
  const { task: taskDict } = await getDictionary(lang)

  const {
    data: tasks,
    pagination: { totalItems, totalPages }
  } = await getTasks({
    page: getPageSchema().parse(searchParams.page),
    limit: getPageSizeSchema({ def: 9 }).parse(searchParams.perPage)
  })

  if (tasks.length === 0) {
    return (
      <NotFount
        title={taskDict.emptyState.title}
        description={taskDict.emptyState.description}
      />
    )
  }

  return (
    <TasksContainer>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map(task => (
          <GridCard key={task.id} lang={lang} task={task} />
        ))}
      </div>

      <TasksPagination totalItems={totalItems} totalPages={totalPages} />
    </TasksContainer>
  )
}
