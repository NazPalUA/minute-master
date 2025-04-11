'use client'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { useDictionary } from '@/hooks'
import { ROUTES } from '@/lib/constants'
import { ClipboardList, Folders, LayoutDashboard, Timer } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTimerDialogQueryState } from '../timer-dialog/lib/use-timer-dialog-query-state'

type NavItem = {
  labelKey: 'dashboard' | 'projects' | 'tasks' | 'timer'
  href: string
  icon: React.ReactNode
}

export function NavItems() {
  const { dashboard: dict, lang } = useDictionary()
  const pathname = usePathname()
  const { openDialog } = useTimerDialogQueryState()

  const navItems: NavItem[] = [
    {
      labelKey: 'timer',
      href: '',
      icon: <Timer className="mr-2 size-4 text-green-500" />
    },
    {
      labelKey: 'dashboard',
      href: ROUTES.DASHBOARD.INDEX(lang),
      icon: <LayoutDashboard className="mr-2 size-4 text-sky-500" />
    },
    {
      labelKey: 'projects',
      href: ROUTES.DASHBOARD.PROJECTS.INDEX(lang),
      icon: <Folders className="mr-2 size-4 text-pink-700" />
    },
    {
      labelKey: 'tasks',
      href: ROUTES.DASHBOARD.TASKS.INDEX(lang),
      icon: <ClipboardList className="mr-2 size-4 text-orange-500" />
    }
  ]

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        {navItems.map(item => (
          <SidebarMenuItem key={item.labelKey} className="list-none">
            <SidebarMenuButton
              size="default"
              className="text-base"
              asChild
              isActive={pathname === item.href}
            >
              {item.labelKey === 'timer' ? (
                <button onClick={openDialog} className="mb-3 cursor-pointer">
                  {item.icon}
                  <span>{dict.navigation[item.labelKey]}</span>
                </button>
              ) : (
                <Link href={item.href}>
                  {item.icon}
                  <span>{dict.navigation[item.labelKey]}</span>
                </Link>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
