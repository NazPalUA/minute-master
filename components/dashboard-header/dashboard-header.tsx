import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import type { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { LanguageSwitcher } from '../language-switcher'
import { ThemeToggle } from '../theme-toggle'
import { DashboardBreadcrumb } from './dashboard-breadcrumb'

export async function DashboardHeader({ lang }: { lang: Language }) {
  const { common: commonDict, dashboard: dashboardDict } =
    await getDictionary(lang)

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-2 px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <DashboardBreadcrumb lang={lang} dict={dashboardDict} />
        <div className="ml-auto hidden md:block">
          <LanguageSwitcher showLabel={false}>
            {commonDict.actions.changeLanguage}
          </LanguageSwitcher>
          <ThemeToggle showLabel={false}>
            {commonDict.actions.toggleTheme}
          </ThemeToggle>
        </div>
      </div>
    </header>
  )
}
