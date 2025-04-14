'use client'

import { AlertDialogDeleteEntity } from '@/components/alert-dialog-delete-entity'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { useDictionary } from '@/hooks'
import { ROUTES } from '@/lib/constants'
import { GetProjectsNamesReturn } from '@/server/data/get-projects-names'
import { Folder, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { use } from 'react'
import { AlertDialogTrigger } from '../ui/alert-dialog'
import { useDeleteProjectAction } from './lib/use-delete-project-action'

export function ProjectsList({
  projectsPromise
}: {
  projectsPromise: Promise<GetProjectsNamesReturn>
}) {
  const { lang, project: projectDict } = useDictionary()
  const { projectId } = useParams<{ projectId?: string }>()
  const { data: projects } = use(projectsPromise)

  const { execute: executeDelete, optimisticState: optimisticProjects } =
    useDeleteProjectAction(projects)

  return optimisticProjects.map(project => (
    <SidebarMenuItem key={project.id}>
      <SidebarMenuButton asChild isActive={projectId === project.id}>
        <Link href={ROUTES.DASHBOARD.PROJECTS.DETAILS(lang, project.id)}>
          <Folder className="mr-3 h-4 w-4 text-blue-500" />
          <span>{project.name}</span>
        </Link>
      </SidebarMenuButton>

      <AlertDialogDeleteEntity
        entity="project"
        onConfirmAction={() => executeDelete({ projectId: project.id })}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuAction>
              <MoreHorizontal />
            </SidebarMenuAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start">
            <DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <span>{projectDict.actions.delete.trigger}</span>
              </AlertDialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </AlertDialogDeleteEntity>
    </SidebarMenuItem>
  ))
}
