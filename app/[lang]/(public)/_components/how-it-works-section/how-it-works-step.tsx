import type { Dictionary } from '@/localization'

type Props = {
  step: Dictionary['public']['home']['howItWorks']['steps'][number]
  index: number
}

export function HowItWorksStep({ step, index }: Props) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="bg-primary text-primary-foreground mb-4 flex size-16 items-center justify-center rounded-full text-2xl font-bold">
        {index + 1}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
      <p className="text-muted-foreground max-w-xs">{step.description}</p>
    </div>
  )
}
