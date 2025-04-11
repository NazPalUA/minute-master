import { TimeCounterProvider } from '@/components/timer-dialog/time-counter-context'
import { TimeDisplay } from '@/components/timer-dialog/time-display'
import { TimerDialogContainer } from '@/components/timer-dialog/timer-dialog-container'
import { countTotalRuntime } from '@/server/data/count-total-runtime'
import { getRunningTimer } from '@/server/data/get-running-timer'
import { ControlButtons } from './control-buttons'
import { MiniTimer } from './mini-timer'
import { TimerSelectors } from './selectors'

export async function TimerDialog() {
  const runningTimer = await getRunningTimer()

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const totalRuntime = await countTotalRuntime({
    from: today.setHours(0, 0, 0, 0),
    to: tomorrow.setHours(0, 0, 0, 0)
  })

  return (
    <TimeCounterProvider
      runningTimer={runningTimer}
      totalRuntime={totalRuntime}
    >
      {runningTimer && <MiniTimer />}
      <TimerDialogContainer>
        <TimeDisplay />
        <TimerSelectors />
        <ControlButtons />
      </TimerDialogContainer>
    </TimeCounterProvider>
  )
}
