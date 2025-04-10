'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useDictionary } from '@/hooks'
import { ArrowRight, Check, Clock } from 'lucide-react'

type Props = {
  billingCycle: 'monthly' | 'yearly'
  savingsAmount: number
  yearlyPricePerMonth: number
  yearlyPrice: number
  monthlyPrice: number
}

export function PricingCard({
  billingCycle,
  savingsAmount,
  yearlyPricePerMonth,
  yearlyPrice,
  monthlyPrice
}: Props) {
  const { public: dict } = useDictionary()

  return (
    <Card className="relative overflow-hidden border-none bg-transparent shadow-none">
      <CardContent className="pt-6 pb-8">
        <div className="mb-8 text-center">
          <div className="flex items-baseline justify-center">
            <span className="text-6xl font-bold">
              $
              {billingCycle === 'monthly'
                ? monthlyPrice
                : yearlyPricePerMonth.toFixed(0)}
            </span>
            <span className="text-muted-foreground ml-2 text-xl">
              /{dict.home.pricing.month}
            </span>
          </div>

          {billingCycle === 'yearly' && (
            <div className="mt-2 font-medium text-green-600 dark:text-green-400">
              {dict.home.pricing.billedAnnually
                .replace('{total}', `$${yearlyPrice.toFixed(0)}`)
                .replace('{savings}', `$${savingsAmount.toFixed(0)}`)}
            </div>
          )}

          <div className="mt-4 flex items-center justify-center gap-2">
            <Clock className="text-primary h-4 w-4" />
            <span className="text-sm">
              {dict.home.pricing.dayFreeTrial.replace('{days}', '14')}
            </span>
          </div>
        </div>

        <div className="mx-auto mb-8 grid max-w-2xl grid-cols-1 gap-4 md:grid-cols-2">
          {dict.home.pricing.features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <div className="mr-3 flex-shrink-0">
                <div className="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-full">
                  <Check className="text-primary h-4 w-4" />
                </div>
              </div>
              <span className="font-medium">{feature}</span>
            </div>
          ))}
        </div>

        <div className="mx-auto flex max-w-md flex-col items-center gap-3">
          <button className="group relative w-full">
            {/* Enhanced animated background with gradient */}
            <span className="from-primary/40 to-primary/40 absolute inset-0 rounded-full bg-gradient-to-r via-purple-500/30 opacity-0 blur-md transition-opacity duration-300 group-hover:animate-pulse group-hover:opacity-100"></span>

            {/* Button with animated border and gradient */}
            <div className="from-primary to-primary/90 relative overflow-hidden rounded-full bg-gradient-to-r px-6 py-4 shadow-[0_0_0_2px_rgba(var(--primary),0.1)] transition-all duration-300 group-hover:shadow-[0_0_0_3px_rgba(var(--primary),0.2)]">
              {/* Enhanced ripple effect with gradient */}
              <span className="absolute inset-0 translate-x-full bg-gradient-to-r from-white/5 via-white/20 to-white/5 transition-transform duration-700 ease-in-out group-hover:translate-x-0"></span>

              <div className="relative flex items-center justify-center">
                <span className="text-primary-foreground text-lg font-medium">
                  {dict.home.pricing.startFreeTrial}
                </span>
                <ArrowRight className="text-primary-foreground ml-2 h-5 w-5 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" />
              </div>
            </div>

            {/* Animated dots with different colors */}
            <div className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 transform space-x-1.5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <span
                className="bg-primary h-1.5 w-1.5 animate-bounce rounded-full"
                style={{ animationDelay: '0ms' }}
              ></span>
              <span
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-500"
                style={{ animationDelay: '150ms' }}
              ></span>
              <span
                className="bg-primary h-1.5 w-1.5 animate-bounce rounded-full"
                style={{ animationDelay: '300ms' }}
              ></span>
            </div>
          </button>

          <p className="text-muted-foreground mt-2 text-center text-xs">
            {dict.home.pricing.noCommitment}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
