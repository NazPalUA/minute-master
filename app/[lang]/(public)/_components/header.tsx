import { LanguageSwitcher } from '@/components/language-switcher'
import { ThemeToggle } from '@/components/theme-toggle'
import { APP_NAME, ROUTES } from '@/lib/constants'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { Zap } from 'lucide-react'
import Link from 'next/link'
import { Auth } from './auth'
import { MobileNavSheet } from './mobile-nav-sheet'

export async function Header({ lang }: { lang: Language }) {
  const { public: dict, common: commonDict } = await getDictionary(lang)

  return (
    <header className="border-border/40 bg-background/90 relative top-0 z-50 border-b backdrop-blur-sm md:sticky">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link
          href={ROUTES.HOME.INDEX(lang)}
          className="flex items-center space-x-2"
        >
          <Zap className="text-primary h-6 w-6" />
          <span className="text-xl font-bold">{APP_NAME}</span>
        </Link>
        <nav className="hidden items-center space-x-4 md:flex">
          <NavLink href={ROUTES.HOME.FEATURES.SECTION(lang)}>
            {dict.layout.header.features}
          </NavLink>
          <NavLink href={ROUTES.HOME.PRICING.SECTION(lang)}>
            {dict.layout.header.pricing}
          </NavLink>
          <NavLink href={ROUTES.DASHBOARD.INDEX(lang)}>
            {dict.layout.header.dashboard}
          </NavLink>
          <Auth lang={lang} />
          <LanguageSwitcher showLabel={false}>
            {commonDict.actions.changeLanguage}
          </LanguageSwitcher>
          <ThemeToggle showLabel={false}>
            {commonDict.actions.toggleTheme}
          </ThemeToggle>
        </nav>
        <MobileNavSheet lang={lang} />
      </div>
    </header>
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
    <Link
      href={href}
      className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
    >
      {children}
    </Link>
  )
}
