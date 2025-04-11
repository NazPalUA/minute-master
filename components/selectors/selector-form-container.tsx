'use client'

import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'
import { FormItem, FormLabel } from '../ui/form'

export function SelectorFormContainer({
  label,
  children,
  className,
  ...props
}: ComponentProps<typeof FormItem> & { label: string }) {
  return (
    <FormItem className={cn('flex-1 space-y-2', className)} {...props}>
      <FormLabel>{label}:</FormLabel>
      {children}
    </FormItem>
  )
}
