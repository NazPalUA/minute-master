'use client'

import { ROUTES } from '@/lib/constants'
import { ClipboardList, Clock, FileText, Folder } from 'lucide-react'
import Link from 'next/link'

import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu'
import { useDictionary } from '@/hooks'
import { GetProjectsNamesReturn } from '@/server/data/get-projects-names/schema-return'

type Props = {
  project: GetProjectsNamesReturn['data'][0]
}

export function BreadcrumbProjectSubmenuItem({ project }: Props) {
  const { dashboard: dict, lang } = useDictionary()

  return (
    <DropdownMenuSub key={project.id}>
      <DropdownMenuSubTrigger>
        <Folder className="mr-3 h-4 w-4 text-blue-500" />
        <span>{project.name}</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem asChild>
            <Link href={ROUTES.DASHBOARD.PROJECTS.DETAILS(lang, project.id)}>
              <FileText />
              <span>{dict.navigation.details}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={ROUTES.DASHBOARD.PROJECTS.TASKS(lang, project.id)}>
              <ClipboardList />
              <span>{dict.navigation.tasks}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={ROUTES.DASHBOARD.PROJECTS.TIME_LOGS(lang, project.id)}>
              <Clock />
              <span>{dict.navigation['time-logs']}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}
