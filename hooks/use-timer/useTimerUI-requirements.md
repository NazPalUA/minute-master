# Technical Requirements for useTimerUI Custom Hook

## Purpose

Create a React custom hook for timer functionality that tracks:

1. The current session duration (time elapsed since the timer was started)
2. The total duration (combination of provided previous duration and current session)

## Core Functionality

- Track elapsed time with millisecond precision
- Support starting and stopping the timer
- Provide formatted time values (hours, minutes, seconds)
- Accept pre-existing elapsed time via props
- Allow initialization with a specific start time
- Implement using TypeScript with proper type definitions
- Avoid using React optimization hooks (useMemo, useCallback) as they are automatically handled by the React compiler
- Determine timer running state based on the presence of startDate (if startDate exists, timer is running)

## API Requirements

### Input Parameters

- `initElapsedMs`: number
  - Represents the total elapsed milliseconds from previous sessions
  - Provided by the parent component, not tracked internally by the hook
  - Required parameter with no default value
- `initStartTime`: Date | undefined
  - Optional parameter to initialize the timer in an already-running state
  - If provided, the timer will begin counting from this timestamp rather than from when `startTimer` is called
  - If omitted, the timer will initialize in a stopped state

### Return Values

- `isRunning`: Boolean indicating if the timer is currently active
  - Should be directly derived from the existence of startDate (true if startDate exists, false otherwise)
- `sessionDuration`: Object containing:
  - `totalElapsedMs`: Total milliseconds in current session only
  - `hours`: Hours component of current session
  - `minutes`: Minutes component of current session
  - `seconds`: Seconds component of current session
- `totalDuration`: Object containing:
  - `totalElapsedMs`: Sum of provided previous duration (`initElapsedMs`) plus current session
  - `hours`: Hours component of total duration
  - `minutes`: Minutes component of total duration
  - `seconds`: Seconds component of total duration
- `startTimer`: Function with signature `(newBaseElapsedMs?: number, newStartTime?: Date) => void`
  - Starts a new timer session, regardless of current timer state
  - Will restart an already running timer with new parameters if called while timer is active
  - Parameters:
    - `newBaseElapsedMs`: Optional parameter to override the current base elapsed time
      - Allows setting a specific starting point for total elapsed time
      - If omitted, preserves the current total time
    - `newStartTime`: Optional parameter to specify when the timer started
      - Allows backdating the timer start time to a specific moment
      - If omitted, defaults to the current time (`new Date()`)
- `stopTimer`: Function to stop the timer
  - Preserves the total elapsed time (previous + current session)
