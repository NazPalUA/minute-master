'use client'

import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { useDictionary } from '@/hooks'
import { ROUTES } from '@/lib/constants'
import { GetProjectsNamesReturn } from '@/server/data/get-projects-names'
import { Folder } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { use } from 'react'

export function ProjectsList({
  projectsPromise
}: {
  projectsPromise: Promise<GetProjectsNamesReturn>
}) {
  const { lang } = useDictionary()
  const { projectId } = useParams<{ projectId?: string }>()
  const { data: projects } = use(projectsPromise)

  return projects.map(project => (
    <SidebarMenuItem key={project.id}>
      <SidebarMenuButton asChild isActive={projectId === project.id}>
        <Link href={ROUTES.DASHBOARD.PROJECTS.DETAILS(lang, project.id)}>
          <Folder className="mr-3 h-4 w-4 text-blue-500" />
          <span>{project.name}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ))
}
