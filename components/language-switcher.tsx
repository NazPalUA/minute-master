'use client'

import { cn } from '@/lib/utils'
import { availableLanguages, Language, languages } from '@/localization'
import { setLanguagePreference } from '@/server/actions/set-language-preference'
import { Globe } from 'lucide-react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { CustomIconButton } from './custom-icon-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'

type Props = {
  children: React.ReactNode
  showLabel?: boolean
  className?: string
}

export function LanguageSwitcher({
  children,
  className,
  showLabel = true
}: Props) {
  const { lang: currentLang } = useParams<{ lang: Language }>()
  const router = useRouter()
  const pathname = usePathname()

  function setLanguage(lang: Language) {
    const segments = pathname.split('/')

    if (segments[1] === lang) return

    setLanguagePreference(lang)

    segments[1] = lang
    const newPath = segments.join('/')

    // Preserve the current URL search parameters
    const currentSearch = window.location.search
    const targetPath = currentSearch ? `${newPath}${currentSearch}` : newPath

    router.push(targetPath)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <CustomIconButton
          showLabel={showLabel}
          className={className}
          icon={<Globe />}
        >
          {children}
        </CustomIconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableLanguages.map(lang => (
          <DropdownMenuItem
            key={lang}
            onClick={() => setLanguage(lang)}
            className={cn(
              currentLang === lang && 'bg-primary text-primary-foreground'
            )}
          >
            {languages[lang]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
