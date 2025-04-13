import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
  SidebarSeparator
} from '@/components/ui/sidebar'
import { APP_NAME } from '@/lib/constants'
import { Language } from '@/localization'
import Logo from '@/public/logo.svg'
import Image from 'next/image'
import { Suspense } from 'react'
import { FooterSettings } from './sidebar-footer-settings'
import { NavItems } from './sidebar-nav-items'
import { Projects } from './sidebar-projects'
import { User, UserFallback } from './sidebar-user'

export async function DashboardSidebar({
  lang,
  ...props
}: React.ComponentProps<typeof Sidebar> & { lang: Language }) {
  return (
    <Sidebar collapsible="icon" variant="sidebar" {...props}>
      <SidebarHeader className="mb-5">
        <SidebarMenuButton className="hover:bg-transparent">
          <Image src={Logo} alt="Logo" unoptimized className="size-6" />
          <span className="text-xl">{APP_NAME}</span>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent>
        <NavItems />
        <SidebarSeparator />
        <Projects lang={lang} />
      </SidebarContent>

      <SidebarFooter>
        <FooterSettings lang={lang} />
        <Suspense fallback={<UserFallback />}>
          <User lang={lang} />
        </Suspense>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
