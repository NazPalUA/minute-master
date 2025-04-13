import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SearchParams } from '@/lib/types'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'
import { AddSectionButton } from './components/add-section-button'

type Params = { lang: Language; projectId: string }

export default async function Details(props: {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
  children: React.ReactNode
}) {
  const { lang } = await props.params
  const dict = await getDictionary(lang)

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>{dict.section.entity.plural}</CardTitle>
        <AddSectionButton>
          {dict.section.actions.create.trigger}
        </AddSectionButton>
      </CardHeader>
      <CardContent>{props.children}</CardContent>
    </Card>
  )
}
