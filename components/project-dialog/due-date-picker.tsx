'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { useDictionary } from '@/hooks'
import { cn, createDateFormatter, dateLocaleMap } from '@/lib/utils'
import { Calendar as CalendarIcon } from 'lucide-react'

type Props = {
  value?: Date
  onChange(date?: Date): void
}

export function DueDatePicker({ value, onChange }: Props) {
  const { common: dict, lang } = useDictionary()

  const dateFormatter = createDateFormatter(lang)

  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? dateFormatter(value) : <span>{dict.actions.pickDate}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          locale={dateLocaleMap[lang]}
          mode="single"
          selected={value}
          onSelect={onChange}
        />
      </PopoverContent>
    </Popover>
  )
}
