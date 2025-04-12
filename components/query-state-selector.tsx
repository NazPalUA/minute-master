'use client'

import { parseAsStringLiteral, useQueryState } from 'nuqs'
import { useTransition } from 'react'
import { Selector } from './selector'

type Props = {
  searchParamsKey: string
  transitionReturn?: UseTransitionReturn
}

type UseTransitionReturn = ReturnType<typeof useTransition>

export function QueryStateSelector<T extends string>({
  placeholder,
  searchParamsKey,
  defaultValue,
  items,
  transitionReturn
}: Props &
  Pick<
    React.ComponentProps<typeof Selector<T>>,
    'items' | 'placeholder' | 'defaultValue'
  >) {
  const transition = useTransition()
  const [isLoading, startTransition] = transitionReturn || transition

  const [value, setValue] = useQueryState(
    searchParamsKey,
    parseAsStringLiteral(items.map(item => item.value))
      .withDefault(defaultValue)
      .withOptions({
        shallow: false,
        startTransition
      })
  )

  return (
    <Selector
      placeholder={placeholder}
      defaultValue={defaultValue}
      value={value}
      setValue={setValue}
      items={items}
      isLoading={isLoading}
    />
  )
}
