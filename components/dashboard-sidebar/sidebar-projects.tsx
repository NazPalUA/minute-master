import { ScrollArea } from '@/components/ui/scroll-area'
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { getProjectsNames } from '@/server/data/get-projects-names'
import { Folder, Plus } from 'lucide-react'
import { Suspense } from 'react'
import { ProjectDialog } from '../project-dialog'
import { ProjectsList } from './sidebar-projects-list'

export async function Projects({ lang }: { lang: Language }) {
  const { dashboard: dict, project: projectsDict } = await getDictionary(lang)
  const projectsPromise = getProjectsNames()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="mb-2 text-lg font-semibold">
        {dict.navigation.projects}
        <ProjectDialog>
          <SidebarGroupAction className="cursor-pointer">
            <Plus />
            <span className="sr-only">
              {projectsDict.actions.create.trigger}
            </span>
          </SidebarGroupAction>
        </ProjectDialog>
      </SidebarGroupLabel>

      <ScrollArea className="h-[40vh] px-1">
        <SidebarGroupContent className="pl-3">
          <SidebarMenu>
            <Suspense fallback={<ProjectsListFallback />}>
              <ProjectsList projectsPromise={projectsPromise} />
            </Suspense>
          </SidebarMenu>
        </SidebarGroupContent>
      </ScrollArea>
    </SidebarGroup>
  )
}

function ProjectsListFallback() {
  const widths = ['w-24', 'w-20', 'w-28', 'w-16', 'w-32']

  return Array.from({ length: 5 }).map((_, index) => (
    <SidebarMenuItem key={index}>
      <SidebarMenuButton>
        <Folder className="mr-3 h-4 w-4 text-blue-500" />
        <Skeleton className={`h-4 ${widths[index]}`} />
      </SidebarMenuButton>
    </SidebarMenuItem>
  ))
}
