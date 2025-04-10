import { Button } from '@/components/ui/button'
import { Dictionary } from '@/localization'
import { Check } from 'lucide-react'

// Type for a plan (basic, pro, or enterprise)
type PlanType = {
  name: string
  features: string[]
}

type Props = {
  plan: PlanType
  planKey: 'basic' | 'pro' | 'enterprise'
  dict: Dictionary['public']['home']['pricing']
}

export function PricingPlanCard({ plan, planKey, dict }: Props) {
  // Get pricing from environment variables based on plan key
  const getPricing = () => {
    if (planKey === 'basic') {
      return {
        monthly: Number(process.env.NEXT_PUBLIC_PRICE_BASIC_MONTHLY),
        yearly: Number(process.env.NEXT_PUBLIC_PRICE_BASIC_YEARLY)
      }
    } else if (planKey === 'pro') {
      return {
        monthly: Number(process.env.NEXT_PUBLIC_PRICE_PRO_MONTHLY),
        yearly: Number(process.env.NEXT_PUBLIC_PRICE_PRO_YEARLY)
      }
    } else {
      return {
        monthly: Number(process.env.NEXT_PUBLIC_PRICE_ENTERPRISE_MONTHLY),
        yearly: Number(process.env.NEXT_PUBLIC_PRICE_ENTERPRISE_YEARLY)
      }
    }
  }

  const pricing = getPricing()

  return (
    <div className="bg-card text-card-foreground flex flex-col rounded-lg border p-6 hover:shadow-lg">
      <h3 className="mb-4 text-2xl font-bold">{plan.name}</h3>
      <div className="mb-6">
        <p className="text-accent-foreground text-4xl font-bold">
          ${pricing.monthly}
          <span className="text-sm font-normal">{`/${dict.month}`}</span>
        </p>
        <p className="mt-2 text-lg">
          ${pricing.yearly}
          <span className="text-sm font-normal">{`/${dict.year}`}</span>
        </p>
      </div>
      <ul className="mb-6 grow">
        {plan.features.map((feature: string, index: number) => (
          <li key={index} className="mb-2 flex items-center">
            <Check className="mr-2 h-5 w-5 text-green-500" />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>
      <div className="space-y-2">
        <Button className="w-full cursor-pointer">{dict.chooseMonthly}</Button>
        <Button className="w-full cursor-pointer" variant="outline">
          {dict.chooseYearly}
        </Button>
      </div>
    </div>
  )
}
