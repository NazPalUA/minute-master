'use client'

import { MoonStar, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { CustomIconButton } from './custom-icon-button'

type Props = {
  children: React.ReactNode
  showLabel?: boolean
  className?: string
}

export function ThemeToggle({ children, className, showLabel = true }: Props) {
  const { theme, setTheme } = useTheme()

  return (
    <CustomIconButton
      icon={
        <>
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <MoonStar className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </>
      }
      showLabel={showLabel}
      className={className}
      onClick={() =>
        setTheme(() => {
          return theme === 'light' ? 'dark' : 'light'
        })
      }
    >
      {children}
    </CustomIconButton>
  )
}
