'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavItem = {
  label: string
  href: string
  icon: React.ReactNode
}

type Props = {
  className?: string
  navItems: NavItem[]
}

export function NavBar({ className, navItems }: Props) {
  const pathname = usePathname()

  return (
    <nav className={cn('flex space-x-4', className)}>
      {navItems.map(item => {
        const isActive = pathname === item.href
        return (
          <Button
            key={item.href}
            variant={isActive ? 'default' : 'secondary'}
            className="flex items-center space-x-2"
            asChild
          >
            <Link href={item.href}>
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}
