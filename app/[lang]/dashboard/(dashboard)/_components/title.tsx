'use client'

import { useDictionary } from '@/hooks'

export function Title() {
  const { dashboard: dict } = useDictionary()

  return <h2 className="text-3xl font-bold tracking-tight">{dict.title}</h2>
}
