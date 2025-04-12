import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SearchParams } from '@/lib/types'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { ProjectProgressMetrics } from './_components/project-progress-metrics'

type Params = { lang: Language; projectId: string }

export default async function ProjectProgressPage(props: {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
}) {
  const { lang, projectId } = await props.params
  const { project: dict } = await getDictionary(lang)

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">
          {dict.analytics.progress.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <ProjectProgressMetrics dict={dict} projectId={projectId} />
      </CardContent>
    </Card>
  )
}
