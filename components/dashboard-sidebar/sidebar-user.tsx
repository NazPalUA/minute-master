import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/lib/constants'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { SignOutButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import { LogOut, Settings, User2 } from 'lucide-react'
import Link from 'next/link'

export async function User({ lang }: { lang: Language }) {
  const { common: commonDict, dashboard: dashboardDict } =
    await getDictionary(lang)
  const user = await currentUser()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar className="size-6 rounded-md">
                <AvatarImage
                  src={user?.imageUrl}
                  alt={`${user?.fullName} avatar`}
                />
                <AvatarFallback className="rounded-md">
                  <User2 className="mr-2" />
                </AvatarFallback>
              </Avatar>
              <span className="truncate font-semibold">
                {user?.fullName || 'User Name'}
              </span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem asChild>
              <Link href={ROUTES.DASHBOARD.SETTINGS(lang)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>{dashboardDict.navigation.settings}</span>
              </Link>
            </DropdownMenuItem>
            <SignOutButton>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{commonDict.actions.logout}</span>
              </DropdownMenuItem>
            </SignOutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function UserFallback() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <Skeleton className="size-6 rounded-md" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="ml-1 h-4 w-16" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
