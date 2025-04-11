import type { SearchParams } from '@/lib/types'
import { Language } from '@/localization'
import { getDictionary } from '@/localization/server'

type Params = { lang: Language }

export default async function Dashboard(props: {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
}) {
  const { lang } = await props.params
  const { dashboard: dict } = await getDictionary(lang)

  return <h2 className="text-3xl font-bold tracking-tight">{dict.title}</h2>
}
