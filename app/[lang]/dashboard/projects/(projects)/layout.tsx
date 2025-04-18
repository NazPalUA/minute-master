import { ProjectDialog } from '@/components/project-dialog'
import { Button } from '@/components/ui/button'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'

type Params = Promise<{ lang: Language }>

export default async function ProjectsLayout(props: {
  params: Params
  children: React.ReactNode
}) {
  const { lang } = await props.params
  const { project: projectDict } = await getDictionary(lang)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          {projectDict.entity.plural}
        </h2>
        <ProjectDialog>
          <Button>{projectDict.actions.create.trigger}</Button>
        </ProjectDialog>
      </div>

      {props.children}
    </div>
  )
}
