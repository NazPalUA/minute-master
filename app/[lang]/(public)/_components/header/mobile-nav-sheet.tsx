import { LanguageSwitcher } from '@/components/language-switcher'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { APP_NAME, ROUTES } from '@/lib/constants'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { Menu, Zap } from 'lucide-react'
import Link from 'next/link'
import { Auth } from './auth'

export const MobileNavSheet = async ({ lang }: { lang: Language }) => {
  const {
    public: {
      layout: { header: headerDict }
    },
    common: { actions: actionsDict }
  } = await getDictionary(lang)

  const navItems = [
    { href: ROUTES.HOME.FEATURES.SECTION(lang), label: headerDict.features },
    { href: ROUTES.HOME.PRICING.SECTION(lang), label: headerDict.pricing },
    { href: ROUTES.DASHBOARD.INDEX(lang), label: headerDict.dashboard }
  ]

  return (
    <Sheet>
      <SheetTrigger className="md:hidden">
        <Menu className="h-10 w-10" />
        <span className="sr-only">{headerDict.menu}</span>
      </SheetTrigger>
      <SheetContent className="md:hidden">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <Zap className="text-primary h-6 w-6" />
            <span>{APP_NAME}</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col space-y-2">
          {navItems.map(item => (
            <SheetClose asChild key={item.href}>
              <Button
                variant="ghost"
                type="button"
                asChild
                className="justify-start"
                size="sm"
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            </SheetClose>
          ))}
          <SheetClose className="w-full">
            <Auth lang={lang} />
          </SheetClose>
        </nav>
        <div className="border-border mt-10 flex flex-col gap-2 border-t pt-2">
          <LanguageSwitcher>{actionsDict.changeLanguage}</LanguageSwitcher>
          <ThemeToggle>{actionsDict.toggleTheme}</ThemeToggle>
        </div>
      </SheetContent>
    </Sheet>
  )
}
