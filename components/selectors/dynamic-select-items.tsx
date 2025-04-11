'use client'

import { SelectItem } from '@/components/ui/select'
import { useDictionary } from '@/hooks'
import useSWR from 'swr'

type SelectorData = { id: string; name: string }

export function DynamicSelectItems({
  url,
  dictKey,
  initialSelectItem
}: {
  url: string | null
  dictKey: 'project' | 'section' | 'task'
  initialSelectItem?: React.ReactNode | null
}) {
  const { data, error, isLoading } = useSWR(url)
  const dict = useDictionary()
  const { loading: loadingText } = dict.common.status
  const { unknown: errorText } = dict.common.errors

  if (isLoading)
    return (
      <>
        {initialSelectItem || null}
        <SelectItem value="loading" disabled>
          {loadingText}
        </SelectItem>
      </>
    )

  if (error)
    return (
      <>
        {initialSelectItem || null}
        <SelectItem value="error" className="text-red-500" disabled>
          {errorText}
        </SelectItem>
      </>
    )

  if (data?.data.length === 0 && dictKey === 'task')
    return (
      <SelectItem value="none" disabled>
        {dict.task.actions.select.none}
      </SelectItem>
    )

  return data?.data?.map((item: SelectorData) => (
    <SelectItem key={item.id} value={item.id}>
      {item.name}
    </SelectItem>
  ))
}
