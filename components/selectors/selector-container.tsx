import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

export function SelectorContainer({
  label,
  children,
  className,
  ...props
}: ComponentProps<'div'> & { label: string }) {
  return (
    <div className={cn('flex-1 space-y-2', className)} {...props}>
      <Label>{label}:</Label>
      {children}
    </div>
  )
}
