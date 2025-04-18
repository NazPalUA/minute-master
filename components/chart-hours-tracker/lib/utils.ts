'use client'

import { ChartConfig } from '@/components/ui/chart'
import {
  dateLocaleMap,
  formatTimeToHoursAndMinutes,
  getChartColorsArr,
  isoWeekToDate
} from '@/lib/utils'
import { Dictionary, Language } from '@/localization'
import {
  type BarStep,
  type GetChartDataHoursTrackerReturn,
  type TimeRange
} from '@/server/data/get-chart-data-hours-tracker'
import { format } from 'date-fns'
import { ValueType } from 'recharts/types/component/DefaultTooltipContent'

function prepareChartDataItem(
  item: GetChartDataHoursTrackerReturn['data'][number]
) {
  const result: Record<string, string | number> = {
    dateLabel: item.dateLabel
  }

  item.analysisArray.forEach(analysis => {
    const name = analysis.name.toLowerCase().replace(/\s+/g, '-')
    result[name] = analysis.totalTime
  })

  return result
}

export function prepareChartData(data: GetChartDataHoursTrackerReturn['data']) {
  return data.map(prepareChartDataItem)
}

export function createChartConfig(uniqueNames: string[]): ChartConfig {
  const colors = getChartColorsArr(uniqueNames.length)

  const config: ChartConfig = {}

  uniqueNames.forEach((name, index) => {
    config[name] = {
      label: name,
      color: colors[index]
    }
  })

  return config
}

export function formatTooltipValue(
  duration: ValueType,
  dict: Dictionary['time']['units']
) {
  if (typeof duration !== 'number') return duration.toLocaleString()
  return formatTimeToHoursAndMinutes(duration, dict, 'long', ' ')
}

export const formatTimeRangeLabel = ({
  value,
  lang,
  barStep,
  timeRange,
  variant
}: {
  lang: Language
  value: string
  barStep: BarStep
  timeRange: TimeRange
  variant: 'short' | 'long'
}) => {
  let date: Date
  try {
    date = barStep === 'week' ? isoWeekToDate(value) : new Date(value)
  } catch (err) {
    console.error(err)
    throw new Error('Invalid date')
  }

  const locale = dateLocaleMap[lang]
  const formatStr = getFormatString(barStep, timeRange, variant)

  return format(date, formatStr, { locale, useAdditionalDayOfYearTokens: true })
}

const getFormatString = (
  barStep: BarStep,
  timeRange: TimeRange,
  variant: 'short' | 'long'
): string => {
  const formatMap = {
    day: {
      thisWeek: { short: 'iii', long: 'PPPP' },
      lastWeek: { short: 'iii', long: 'PPPP' },
      thisMonth: { short: 'd', long: 'PPPP' },
      lastMonth: { short: 'd', long: 'PPPP' },
      thisYear: { short: 'D', long: 'PPPP' },
      lastYear: { short: 'D', long: 'PPPP' },
      allTime: { short: 'P', long: 'PPPP' }
    },
    week: {
      thisYear: { short: 'I', long: "yyyy ',' I" },
      lastYear: { short: 'I', long: "yyyy ',' I" }
    },
    month: {
      thisYear: { short: 'MMM', long: 'MMMM yyyy' },
      lastYear: { short: 'MMM', long: 'MMMM yyyy' },
      allTime: { short: 'MMM yy', long: 'MMMM yyyy' }
    },
    year: {
      allTime: { short: 'yyyy', long: 'yyyy' }
    }
  } as const

  const barStepFormats = formatMap[barStep] || {}
  const timeRangeFormats =
    barStepFormats[timeRange as keyof typeof barStepFormats]
  const format = timeRangeFormats?.[variant]

  return format || ''
}
