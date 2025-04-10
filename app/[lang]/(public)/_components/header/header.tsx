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
    <header className="border-border/40 bg-background/90 relative top-0 z-50 border-b backdrop-blur-sm md:sticky">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link
          href={ROUTES.HOME.INDEX(lang)}
          className="flex items-center space-x-2"
        >
          <Zap className="text-primary h-6 w-6" />
          <span className="text-xl font-bold">{APP_NAME}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-4 md:flex">
          {navItems.map(item => (
            <Link
              className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
              key={item.href}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
          <Auth lang={lang} />
          <LanguageSwitcher showLabel={false}>
            {actionsDict.changeLanguage}
          </LanguageSwitcher>
          <ThemeToggle showLabel={false}>{actionsDict.toggleTheme}</ThemeToggle>
        </nav>

        {/* Mobile Navigation */}
        <MobileNavSheet lang={lang} />
      </div>
    </header>
  )
}
