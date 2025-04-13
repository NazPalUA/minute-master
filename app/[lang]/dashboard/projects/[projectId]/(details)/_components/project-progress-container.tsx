'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDictionary } from '@/hooks/use-dictionary'

export default function ProjectProgressContainer(props: {
  children: React.ReactNode
}) {
  const { project: dict } = useDictionary()

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">
          {dict.analytics.progress.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">{props.children}</CardContent>
    </Card>
  )
}
