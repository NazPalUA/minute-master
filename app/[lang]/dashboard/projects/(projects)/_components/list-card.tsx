import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'
import { msToH } from '@/lib/utils'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { countTotalRuntime } from '@/server/data/count-total-runtime'
import { GetProjectsReturn } from '@/server/data/get-projects'
import { BarChart2, Clock } from 'lucide-react'
import Link from 'next/link'
import { getProgress } from '../_lib/getProgress'

export async function ListCard({
  lang,
  project,
  index,
  length
}: {
  lang: Language
  project: GetProjectsReturn['data'][number]
  index: number
  length: number
}) {
  const { estimatedTime, status, name, description, id } = project

  const { common: dict } = await getDictionary(lang)

  const { total: totalRuntime } = await countTotalRuntime({
    projectId: id
  })

  return (
    <div
      key={id}
      className={`flex items-center justify-between p-4 ${index !== length - 1 ? 'border-b' : ''}`}
    >
      <div className="flex-1">
        <h3 className="font-semibold">{name}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <div className="flex items-center space-x-4">
        <StatusBadge status={status} dict={dict} />

        <div className="flex items-center">
          <Clock className="mr-1 h-4 w-4" />
          <span className="text-sm">{msToH(totalRuntime)}</span>
        </div>
        <div className="flex items-center">
          <BarChart2 className="mr-1 h-4 w-4" />
          <span className="text-sm">
            {getProgress(totalRuntime, estimatedTime)}%
          </span>
        </div>
        <Link href={ROUTES.DASHBOARD.PROJECTS.DETAILS(lang, id)}>
          <Button variant="outline" size="sm">
            {dict.view.label}
          </Button>
        </Link>
      </div>
    </div>
  )
}
