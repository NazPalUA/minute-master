import { NotFount } from '@/components/not-fount'
import { TabsContent } from '@/components/ui/tabs'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { getProjects } from '@/server/data/get-projects'
import { GridCard } from './_components/grid-card'
import { ListCard } from './_components/list-card'

type Params = Promise<{ lang: Language }>

export default async function Projects(props: { params: Params }) {
  const { lang } = await props.params
  const { project: dict } = await getDictionary(lang)
  const { data: projects } = await getProjects()

  if (projects.length === 0) {
    return (
      <NotFount
        title={dict.emptyState.noProjects}
        description={dict.emptyState.description}
      />
    )
  }

  return (
    <>
      <TabsContent value="grid" className="mt-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <GridCard key={project.id} lang={lang} project={project} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="list" className="mt-6">
        <div className="rounded-md border">
          {projects.map((project, index) => (
            <ListCard
              key={project.id}
              lang={lang}
              project={project}
              index={index}
              length={projects.length}
            />
          ))}
        </div>
      </TabsContent>
    </>
  )
}
