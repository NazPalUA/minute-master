import { Language } from '@/localization'
import ProjectProgressContainer from './_components/project-progress-container'
type Params = Promise<{ lang: Language; projectId: string }>

export default async function DetailsLayout(props: {
  params: Params
  children: React.ReactNode
  timeDistribution: React.ReactNode
  trackedTime: React.ReactNode
  sections: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
      {props.timeDistribution}
      {props.trackedTime}
      <ProjectProgressContainer>{props.children}</ProjectProgressContainer>
      {props.sections}
    </div>
  )
}
