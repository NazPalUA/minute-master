import { LanguageSwitcher } from '@/components/language-switcher'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'

export async function FooterSettings({ lang }: { lang: Language }) {
  const { common: commonDict } = await getDictionary(lang)

  return (
    <SidebarMenu className="flex flex-row justify-between group-data-[collapsible=icon]:flex-col md:hidden">
      <SidebarMenuItem className="flex-1">
        <SidebarMenuButton asChild>
          <ThemeToggle>{commonDict.actions.toggleTheme}</ThemeToggle>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <LanguageSwitcher showLabel={false}>
            {commonDict.actions.changeLanguage}
          </LanguageSwitcher>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
