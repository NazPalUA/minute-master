export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
      {props.children}
    </div>
  )
}
