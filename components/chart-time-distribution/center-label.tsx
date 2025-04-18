'use client'

import { useDictionary } from '@/hooks/use-dictionary'
import { formatDuration } from '@/lib/utils'
import type { LabelProps } from 'recharts'

type Props = {
  labelProps: LabelProps
  durationMs: number
}

export const CenterLabel = ({ labelProps, durationMs }: Props) => {
  const { time: dict } = useDictionary()
  const formattedTotalTime = formatDuration(durationMs, dict.units)

  const { viewBox } = labelProps

  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
    const cx = viewBox.cx || 0
    const cy = viewBox.cy || 0

    return (
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
        <tspan x={cx} y={cy} className="fill-foreground text-2xl font-bold">
          {formattedTotalTime}
        </tspan>
        <tspan x={cx} y={cy + 24} className="fill-muted-foreground">
          {dict.common.totalTime}
        </tspan>
      </text>
    )
  }
  return null
}
