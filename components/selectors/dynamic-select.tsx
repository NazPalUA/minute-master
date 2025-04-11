'use client'

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useDictionary } from '@/hooks'
import { ComponentProps } from 'react'
import { DynamicSelectItems } from './dynamic-select-items'
import { SelectorContainer } from './selector-container'

export function DynamicSelect({
  url,
  dictKey,
  ...props
}: {
  url: string | null
  dictKey: 'project' | 'section' | 'task'
} & ComponentProps<typeof Select>) {
  const dict = useDictionary()
  const label = dict[dictKey].entity.plural
  const { placeholder } = dict[dictKey].actions.select

  return (
    <SelectorContainer label={label}>
      <Select {...props}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <DynamicSelectItems url={url} dictKey={dictKey} />
        </SelectContent>
      </Select>
    </SelectorContainer>
  )
}
