import { Language } from '@/localization'

type Params = Promise<{ lang: Language; projectId: string }>

export default async function DetailsLayout(props: {
  params: Params
  children: React.ReactNode
  timeDistribution: React.ReactNode
  trackedTime: React.ReactNode
  progress: React.ReactNode
  sections: React.ReactNode
}) {
  return (
    <>
      {props.children}
      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
        {props.timeDistribution}
        {props.trackedTime}
        {props.progress}
        {props.sections}
      </div>
    </>
  )
}
