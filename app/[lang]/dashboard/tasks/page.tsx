import { NotFount } from '@/components/not-fount'
import { TabsContent } from '@/components/ui/tabs'
import { taskStatuses } from '@/lib/constants/task-statuses'
import { getPageSchema, getPageSizeSchema } from '@/lib/schemas'
import { SearchParams } from '@/lib/types'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { getTasks } from '@/server/data/get-tasks'
import { BoardSection } from './_components/board-section'
import { ListCard } from './_components/list-card'
import { TabsContainer } from './_components/tabs-container'
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
    limit: getPageSizeSchema().parse(searchParams.perPage)
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
    <TabsContainer>
      <TabsContent value="list" className="mt-6">
        <div className="rounded-md border">
          {tasks.map((task, index) => (
            <ListCard
              key={task.id}
              lang={lang}
              task={task}
              index={index}
              length={tasks.length}
            />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="board" className="mt-6">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {taskStatuses.map(status => (
            <BoardSection
              key={status}
              lang={lang}
              status={status}
              tasks={tasks.filter(task => task.status === status)}
            />
          ))}
        </div>
      </TabsContent>
      <TasksPagination totalItems={totalItems} totalPages={totalPages} />
    </TabsContainer>
  )
}
