export default async function TasksLayout(props: {
  children: React.ReactNode
  cards: React.ReactNode
}) {
  return (
    <>
      {props.cards}
      {props.children}
    </>
  )
}
