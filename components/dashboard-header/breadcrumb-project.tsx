'use client'

import {
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { GetProjectsNamesReturn } from '@/server/data/get-projects-names'
import { ChevronDown, Slash } from 'lucide-react'
import { useParams } from 'next/navigation'
import { use } from 'react'
import { BreadcrumbProjectSubmenuItem } from './breadcrumb-project-submenu-item'

type Props = {
  projectNamesPromise: Promise<GetProjectsNamesReturn>
}

export function BreadcrumbProject({ projectNamesPromise }: Props) {
  const { projectId } = useParams<{ projectId?: string }>()

  if (!projectId) return null

  const { data: projects } = use(projectNamesPromise)
  const currentProject = projects?.find(project => project.id === projectId)

  if (!currentProject) return null

  return (
    <>
      <BreadcrumbSeparator>
        <Slash />
      </BreadcrumbSeparator>

      <BreadcrumbItem>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1">
            <BreadcrumbPage>{currentProject.name}</BreadcrumbPage>
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {projects?.map(project => (
              <BreadcrumbProjectSubmenuItem
                key={project.id}
                project={project}
              />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </BreadcrumbItem>
    </>
  )
}
