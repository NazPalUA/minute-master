'use client'

import { type TimeParts, millisecondsToTimeParts } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

type UseTimerUI = {
  isRunning: boolean
  sessionDuration: TimeParts
  totalDuration: TimeParts
  startTimer: (newBaseElapsedMs?: number, newStartTime?: Date) => void
  stopTimer: () => void
}

/**
 * Custom hook for timer functionality.
 * @param initElapsedMs - Total elapsed milliseconds from previous sessions
 * @param initStartTime - Optional parameter to initialize timer in already-running state
 * @returns Timer state and control functions
 */
export const useTimerUI = (
  initElapsedMs: number,
  initStartTime?: Date
): UseTimerUI => {
  const [startDate, setStartDate] = useState<Date | undefined>(initStartTime)
  const [baseElapsedMs, setBaseElapsedMs] = useState<number>(initElapsedMs)
  const [currentSessionMs, setCurrentSessionMs] = useState<number>(0)
  const intervalRef = useRef<number | null>(null)
  const isRunning = !!startDate

  useEffect(() => {
    if (startDate) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
      }

      intervalRef.current = window.setInterval(() => {
        const now = new Date()
        const elapsedMs = now.getTime() - startDate.getTime()
        setCurrentSessionMs(elapsedMs)
      }, 50)

      const now = new Date()
      const elapsedMs = now.getTime() - startDate.getTime()
      setCurrentSessionMs(elapsedMs)
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
      }
    }
  }, [startDate])

  const sessionDuration = {
    ...millisecondsToTimeParts(currentSessionMs),
    totalElapsedMs: currentSessionMs
  }
  const totalDuration = {
    ...millisecondsToTimeParts(baseElapsedMs + currentSessionMs),
    totalElapsedMs: baseElapsedMs + currentSessionMs
  }

  /**
   * Start the timer
   * @param newBaseElapsedMs - Optional parameter to override the current base elapsed time
   * @param newStartTime - Optional parameter to specify when the timer started
   */
  const startTimer = (newBaseElapsedMs?: number, newStartTime?: Date) => {
    if (newBaseElapsedMs !== undefined) {
      setBaseElapsedMs(newBaseElapsedMs)
    } else if (startDate) {
      setBaseElapsedMs(prevBase => prevBase + currentSessionMs)
    }

    setStartDate(newStartTime || new Date())
    setCurrentSessionMs(0)
  }

  /**
   * Stop the timer
   */
  const stopTimer = () => {
    setStartDate(undefined)
  }

  return {
    isRunning,
    sessionDuration,
    totalDuration,
    startTimer,
    stopTimer
  }
}
