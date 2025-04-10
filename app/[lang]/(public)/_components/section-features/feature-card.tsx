import { LucideIcon } from 'lucide-react'

type Props = {
  icon: LucideIcon
  title: string
  description: string
}

export function FeatureCard({ icon: Icon, title, description }: Props) {
  return (
    <div className="group bg-card/50 hover:border-primary/50 hover:shadow-primary/10 relative flex flex-col rounded-lg border p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="bg-primary/10 text-primary group-hover:bg-primary/20 mb-5 inline-flex size-10 items-center justify-center rounded-md transition-all duration-300">
        <Icon className="size-5" />
      </div>
      <h3 className="mb-2 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="text-muted-foreground text-base leading-relaxed">
        {description}
      </p>
    </div>
  )
}
