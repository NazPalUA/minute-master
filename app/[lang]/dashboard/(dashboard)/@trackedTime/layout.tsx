import {
  ChartHoursTrackerContainer,
  ChartHoursTrackerProvider
} from '@/components/chart-hours-tracker'

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <ChartHoursTrackerProvider>
      <ChartHoursTrackerContainer>{props.children}</ChartHoursTrackerContainer>
    </ChartHoursTrackerProvider>
  )
}
