'use client'

import { useDictionary } from '@/hooks/use-dictionary'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { useEffect, useId, useRef, useState } from 'react'
import {
  LABEL_KEYS_LENGTH,
  LABEL_KEYS_UNIT,
  type LabelLength,
  MAX_VALUES,
  TEXT_SIZE_THRESHOLDS,
  type Variant
} from './lib/consts'
import { getResponsiveTextSize } from './lib/utils'

const counterVariants = cva(
  'relative flex items-center justify-center rounded-full w-full aspect-square',
  {
    variants: {
      variant: {
        sec: 'data-[variant=sec]:text-orange-500 [--start-color:theme(colors.orange.500)] [--end-color:theme(colors.yellow.300)]',
        min: 'data-[variant=min]:text-green-500 [--start-color:theme(colors.green.400)] [--end-color:theme(colors.green.500)]',
        hrs: 'data-[variant=hrs]:text-blue-500 [--start-color:theme(colors.blue.500)] [--end-color:theme(colors.blue.300)]'
      }
    },
    defaultVariants: {
      variant: 'sec'
    }
  }
)

type Props = VariantProps<typeof counterVariants> & {
  value: number
  maxValue?: number
  className?: string
  label?: LabelLength
}

export const FancyCounter = ({
  value,
  maxValue,
  variant = 'sec',
  label = 'short',
  className
}: Props) => {
  const { time: dict } = useDictionary()
  const [containerSize, setContainerSize] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const gradientId = useId()

  const max = maxValue ?? MAX_VALUES[variant as Variant]

  const clampedValue = Math.max(0, Math.min(value, max))
  const progress = (clampedValue / max) * 100
  const radius = containerSize * 0.375
  const strokeWidth = Math.max(containerSize * 0.04, 2)
  const strokeDasharray = 2 * Math.PI * radius
  const strokeDashoffset = strokeDasharray * ((100 - progress) / 100)

  const labelKeyUnit = LABEL_KEYS_UNIT[variant as Variant]
  const labelKeyLength = LABEL_KEYS_LENGTH[label]
  const variantLabel = dict.units[labelKeyUnit][labelKeyLength] ?? variant

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const updateSize = () => setContainerSize(element.offsetWidth)
    const resizeObserver = new ResizeObserver(() =>
      requestAnimationFrame(updateSize)
    )

    updateSize()
    resizeObserver.observe(element)
    return () => resizeObserver.disconnect()
  }, [])

  const valueSize = getResponsiveTextSize(
    containerSize,
    TEXT_SIZE_THRESHOLDS.value,
    'text-6xl'
  )
  const labelSize = getResponsiveTextSize(
    containerSize,
    TEXT_SIZE_THRESHOLDS.label,
    'text-lg'
  )

  return (
    <div
      ref={containerRef}
      className={cn(counterVariants({ variant: variant }), className)}
      data-variant={variant}
    >
      <svg className="absolute h-full w-full -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="none"
          stroke="#2A2A2A"
          strokeWidth={strokeWidth}
          className="opacity-25"
        />

        <defs>
          <linearGradient id={gradientId}>
            <stop offset="0%" stopColor="var(--start-color)" />
            <stop offset="100%" stopColor="var(--end-color)" />
          </linearGradient>
        </defs>

        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>

      <div className="z-10 text-center">
        <span className={`text-foreground font-bold ${valueSize}`}>
          {value}
        </span>
        <p className={`text-muted-foreground uppercase ${labelSize}`}>
          {typeof variantLabel === 'string'
            ? variantLabel
            : String(variantLabel)}
        </p>
      </div>
    </div>
  )
}
