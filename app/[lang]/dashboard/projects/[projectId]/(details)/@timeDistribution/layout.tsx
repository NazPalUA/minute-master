import {
  ChartTimeDistributionContainer,
  ChartTimeDistributionProvider
} from '@/components/chart-time-distribution'

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <ChartTimeDistributionProvider>
      <ChartTimeDistributionContainer>
        {props.children}
      </ChartTimeDistributionContainer>
    </ChartTimeDistributionProvider>
  )
}
