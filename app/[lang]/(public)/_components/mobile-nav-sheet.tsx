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
  const { public: dict, common: commonDict } = await getDictionary(lang)
  return (
    <Sheet>
      <SheetTrigger className="md:hidden">
        <>
          <Menu className="h-10 w-10" />
          <span className="sr-only">{dict.layout.header.menu}</span>
        </>
      </SheetTrigger>
      <SheetContent className="md:hidden">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <Zap className="text-primary h-6 w-6" />
            <span>{APP_NAME}</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col space-y-2">
          <NavLink href={ROUTES.HOME.FEATURES.SECTION(lang)}>
            {dict.layout.header.features}
          </NavLink>
          <NavLink href={ROUTES.HOME.PRICING.SECTION(lang)}>
            {dict.layout.header.pricing}
          </NavLink>
          <NavLink href={ROUTES.DASHBOARD.INDEX(lang)}>
            {dict.layout.header.dashboard}
          </NavLink>
          <SheetClose className="w-full">
            <Auth lang={lang} />
          </SheetClose>
        </nav>
        <div className="border-border mt-10 flex flex-col gap-2 border-t pt-2">
          <LanguageSwitcher>
            {commonDict.actions.changeLanguage}
          </LanguageSwitcher>
          <ThemeToggle>{commonDict.actions.toggleTheme}</ThemeToggle>
        </div>
      </SheetContent>
    </Sheet>
  )
}

const NavLink = ({
  href,
  children
}: {
  href: string
  children: React.ReactNode
}) => {
  return (
    <SheetClose asChild>
      <Button
        variant="ghost"
        type="button"
        asChild
        className="justify-start"
        size="sm"
      >
        <Link href={href} className="">
          {children}
        </Link>
      </Button>
    </SheetClose>
  )
}
