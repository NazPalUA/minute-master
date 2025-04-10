'use client'

import { useDictionary } from '@/hooks'

type Props = {
  billingCycle: 'monthly' | 'yearly'
  setBillingCycle: (billingCycle: 'monthly' | 'yearly') => void
  discountPercentage: number
}

export function BillingToggle({
  billingCycle,
  setBillingCycle,
  discountPercentage
}: Props) {
  const {
    public: {
      home: { pricing: dict }
    }
  } = useDictionary()

  return (
    <div className="mb-12 flex items-center justify-center">
      <div className="bg-muted/50 flex items-center gap-3 rounded-full border p-1 backdrop-blur-sm">
        <button
          onClick={() => setBillingCycle('monthly')}
          className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
            billingCycle === 'monthly'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {dict.monthly}
        </button>
        <button
          onClick={() => setBillingCycle('yearly')}
          className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
            billingCycle === 'yearly'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {dict.yearly}
          <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
            {dict.save} {discountPercentage}%
          </span>
        </button>
      </div>
    </div>
  )
}
