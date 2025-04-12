import { ProjectDialog } from '@/components/project-dialog'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { getProjectInfo } from '@/server/data/get-project-info'
import { ClipboardList, Clock, FileText, Pencil } from 'lucide-react'
import { Suspense } from 'react'
import { NavBar } from './_components/nav-bar'
import { ProjectInfo, ProjectInfoSkeleton } from './_components/project-info'
import {
  ProjectStatus,
  ProjectStatusSkeleton
} from './_components/project-status'

type Params = Promise<{ lang: Language; projectId: string }>

export default async function ProjectLayout(props: {
  params: Params
  children: React.ReactNode
}) {
  const { projectId, lang } = await props.params
  const { dashboard: dict, project: projectDict } = await getDictionary(lang)

  const navItems = [
    {
      href: ROUTES.DASHBOARD.PROJECTS.DETAILS(lang, projectId),
      label: dict.navigation.details,
      icon: <FileText className="h-4 w-4" />
    },
    {
      href: ROUTES.DASHBOARD.PROJECTS.TASKS(lang, projectId),
      label: dict.navigation.tasks,
      icon: <ClipboardList className="h-4 w-4" />
    },
    {
      href: ROUTES.DASHBOARD.PROJECTS.TIME_LOGS(lang, projectId),
      label: dict.navigation['time-logs'],
      icon: <Clock className="h-4 w-4" />
    }
  ]

  const projectInfoPromise = getProjectInfo({ projectId })

  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center justify-between">
        <Suspense fallback={<ProjectInfoSkeleton />}>
          <ProjectInfo projectInfoPromise={projectInfoPromise} />
        </Suspense>
        <Suspense fallback={<ProjectStatusSkeleton />}>
          <ProjectStatus
            projectInfoPromise={projectInfoPromise}
            projectId={projectId}
          />
        </Suspense>
      </div>
      <div className="flex items-center justify-between">
        <NavBar navItems={navItems} />
        <Suspense>
          <ProjectDialog projectInfoPromise={projectInfoPromise}>
            <Button variant="outline" size="icon">
              <span className="sr-only">
                {projectDict.actions.update.trigger}
              </span>
              <Pencil className="h-4 w-4" />
            </Button>
          </ProjectDialog>
        </Suspense>
      </div>
      {props.children}
    </div>
  )
}
