'use client'

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { useDictionary } from '@/hooks'
import { cn } from '@/lib/utils'
import { dateLocaleMap } from '@/lib/utils/date-formater'
import { ComponentProps } from 'react'
import { DateTimePicker } from './ui/datetime-picker'

type Props = {
  label: string
  className?: string
}

export function DateTimeFormItem({
  label,
  className,
  ...props
}: Props & ComponentProps<typeof DateTimePicker>) {
  const { lang } = useDictionary()

  return (
    <FormItem className={cn('', className)}>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <DateTimePicker locale={dateLocaleMap[lang]} {...props} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}
