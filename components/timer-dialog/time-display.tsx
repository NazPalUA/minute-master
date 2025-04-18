'use client'

import { FancyCounter } from '@/components/fancy-counter'
import { TimeCounterContext } from '@/components/timer-dialog/time-counter-context'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDictionary } from '@/hooks/use-dictionary'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { padAndJoinTimeValues } from '@/lib/utils'
import { use } from 'react'

export function TimeDisplay() {
  const {
    totalDuration: { hours, minutes, seconds }
  } = use(TimeCounterContext)

  const { common: commonDict, time: timeDict } = useDictionary()
  const [activeTab, setActiveTab] = useLocalStorage('timeDisplayTab', 'simple')

  return (
    <Tabs
      defaultValue={activeTab}
      className="w-full"
      onValueChange={value => setActiveTab(value)}
    >
      <TabsList className="flex size-fit rounded-full border-none shadow-none">
        <TabsTrigger
          value="simple"
          className="size-fit rounded-full border-none text-xs shadow-none"
        >
          {commonDict.view.default}
        </TabsTrigger>
        <TabsTrigger
          value="fancy"
          className="size-fit rounded-full border-none text-xs shadow-none"
        >
          {commonDict.view.fancy}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="simple" className="text-center">
        <div className="text-muted-foreground mb-1 text-sm">
          {timeDict.periods.today}
        </div>
        <div className="text-primary text-6xl font-bold">
          {padAndJoinTimeValues(hours, minutes, seconds)}
        </div>
      </TabsContent>

      <TabsContent value="fancy" className="text-center">
        <div className="text-muted-foreground mb-1 text-sm">
          {timeDict.periods.today}
        </div>
        <div className="mx-auto flex w-full items-center justify-center gap-4">
          <FancyCounter value={hours} variant="hrs" label="long" />
          <FancyCounter value={minutes} variant="min" label="long" />
          <FancyCounter value={seconds} variant="sec" label="long" />
        </div>
      </TabsContent>
    </Tabs>
  )
}
