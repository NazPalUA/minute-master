'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDictionary } from '@/hooks'
import { cn } from '@/lib/utils'
import { ReactNode, use } from 'react'
import { TasksTableContext } from '../_lib/tasks-table-context'

export function TabsContainer({ children }: { children: ReactNode }) {
  const { common: dict } = useDictionary()
  const { isPending } = use(TasksTableContext)

  return (
    <>
      <Tabs
        defaultValue="list"
        className={cn('w-full', { 'opacity-30': isPending })}
      >
        <TabsList>
          <TabsTrigger value="list">{dict.view.list}</TabsTrigger>
          <TabsTrigger value="board">{dict.view.board}</TabsTrigger>
        </TabsList>
        {children}
      </Tabs>
    </>
  )
}
