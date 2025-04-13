export default function Dashboard(props: {
  children: React.ReactNode
  cards: React.ReactNode
  timeDistribution: React.ReactNode
  trackedTime: React.ReactNode
}) {
  return (
    <>
      {props.children}
      {props.cards}
      <div className="flex flex-col gap-4 2xl:flex-row">
        {props.timeDistribution}
        {props.trackedTime}
      </div>
    </>
  )
}
