import type { Dictionary } from '@/localization'

type Props = {
  step: Dictionary['public']['home']['howItWorks']['steps'][number]
  index: number
}

export function HowItWorksStep({ step, index }: Props) {
  return (
    <div className="group flex flex-col items-center text-center">
      <div className="bg-primary text-primary-foreground group-hover:shadow-primary/20 mb-5 flex size-14 items-center justify-center rounded-full text-xl font-bold shadow-sm transition-all duration-300 group-hover:shadow-md">
        {index + 1}
      </div>
      <h3 className="mb-2 text-lg font-semibold tracking-tight">
        {step.title}
      </h3>
      <p className="text-muted-foreground max-w-xs text-base leading-relaxed">
        {step.description}
      </p>
    </div>
  )
}
