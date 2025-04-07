'use client'

import { cn } from '@/lib/utils'
import { Button } from './ui/button'

type CustomIconButtonProps = React.ComponentProps<'button'> & {
  children: React.ReactNode
  className?: string
  icon: React.ReactNode
  showLabel?: boolean
}

export function CustomIconButton({
  children,
  className,
  icon,
  showLabel = false,
  ...props
}: CustomIconButtonProps) {
  return (
    <Button
      variant="ghost"
      type="button"
      size={showLabel ? 'default' : 'icon'}
      className={cn(showLabel && 'w-full justify-start gap-2', className)}
      {...props}
    >
      {icon}
      <span className={showLabel ? '' : 'sr-only'}>{children}</span>
    </Button>
  )
}
