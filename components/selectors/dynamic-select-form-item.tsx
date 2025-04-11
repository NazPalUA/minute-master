'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useDictionary } from '@/hooks'
import { ComponentProps } from 'react'
import { FormControl, FormMessage } from '../ui/form'
import { DynamicSelectItems } from './dynamic-select-items'
import { SelectorFormContainer } from './selector-form-container'

type SelectorData = { id: string; name: string }

export function DynamicSelectFormItem({
  url,
  dictKey,
  initialOption,
  ...props
}: {
  url: string | null
  dictKey: 'project' | 'section' | 'task'
  initialOption?: SelectorData
} & ComponentProps<typeof Select>) {
  const dict = useDictionary()
  const label = dict[dictKey].entity.plural
  const { placeholder } = dict[dictKey].actions.select

  const initialSelectComponent = initialOption ? (
    <SelectItem value={initialOption.id}>{initialOption.name}</SelectItem>
  ) : null

  return (
    <SelectorFormContainer label={label}>
      <Select {...props}>
        <FormControl>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </FormControl>

        <SelectContent>
          <DynamicSelectItems
            url={url}
            dictKey={dictKey}
            initialSelectItem={initialSelectComponent}
          />
        </SelectContent>
      </Select>
      <FormMessage />
    </SelectorFormContainer>
  )
}
