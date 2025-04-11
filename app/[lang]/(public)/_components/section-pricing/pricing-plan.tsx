'use client'

import { env } from '@/env'
import { useState } from 'react'
import { BillingToggle } from './billing-toggle'
import { PricingCard } from './pricing-card'

export function PricingPlan() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'yearly'
  )

  const monthlyPrice = env.NEXT_PUBLIC_PRICE_MONTHLY
  const yearlyPrice = env.NEXT_PUBLIC_PRICE_YEARLY

  const yearlyPricePerMonth = yearlyPrice / 12
  const savingsAmount = monthlyPrice * 12 - yearlyPrice
  const discountPercentage = Math.round(
    (savingsAmount / (monthlyPrice * 12)) * 100
  )

  return (
    <>
      <BillingToggle
        billingCycle={billingCycle}
        setBillingCycle={setBillingCycle}
        discountPercentage={discountPercentage}
      />

      <PricingCard
        billingCycle={billingCycle}
        savingsAmount={savingsAmount}
        yearlyPricePerMonth={yearlyPricePerMonth}
        yearlyPrice={yearlyPrice}
        monthlyPrice={monthlyPrice}
      />
    </>
  )
}
