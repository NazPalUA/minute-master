'use client'

import { BreadcrumbItem, BreadcrumbPage } from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useDictionary } from '@/hooks'
import { ROUTES } from '@/lib/constants'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

export function BreadcrumbDirectory() {
  const { dashboard: dict, lang } = useDictionary()
  const { projectId } = useParams<{ projectId?: string }>()
  const pathname = usePathname()
  const directory = pathname.split('/')[3] as
    | 'projects'
    | 'tasks'
    | 'timer'
    | 'settings'
    | undefined

  const getDirectoryLabel = () => {
    if (directory === 'projects' && !projectId) {
      return <BreadcrumbPage>{dict.navigation.projects}</BreadcrumbPage>
    }

    if (directory === 'projects') {
      return dict.navigation.projects
    }

    if (directory) {
      return <BreadcrumbPage>{dict.navigation[directory]}</BreadcrumbPage>
    }

    return null
  }

  const navigationLinks = [
    {
      href: ROUTES.DASHBOARD.PROJECTS.INDEX(lang),
      label: dict.navigation.projects
    },
    {
      href: ROUTES.DASHBOARD.TASKS.INDEX(lang),
      label: dict.navigation.tasks
    },
    {
      href: ROUTES.DASHBOARD.SETTINGS(lang),
      label: dict.navigation.settings
    }
  ]

  return (
    <BreadcrumbItem>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1">
          {getDirectoryLabel()}
          <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {navigationLinks.map(({ href, label }) => (
            <DropdownMenuItem key={href} asChild>
              <Link href={href}>{label}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </BreadcrumbItem>
  )
}
