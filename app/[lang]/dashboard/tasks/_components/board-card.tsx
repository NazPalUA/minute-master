import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { GetTasksReturn } from '@/server/data/get-tasks'
import { Clock } from 'lucide-react'

export async function BoardCard({
  lang,
  task
}: {
  lang: Language
  task: GetTasksReturn['data'][number]
}) {
  const { common: dict } = await getDictionary(lang)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{task.name}</CardTitle>
        <CardDescription>
          {task.project} &bull; {task.section}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {task.description && <p className="text-sm">{task.description}</p>}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            <span className="text-sm">{task.estimatedTime}</span>
          </div>

          <Button variant="outline" size="sm">
            {dict.view.label}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
