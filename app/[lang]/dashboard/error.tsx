'use client'

import ErrorBoundary from '@/components/error-boundary'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex h-full w-full flex-grow items-center justify-center">
      <ErrorBoundary error={error} reset={reset} />
    </div>
  )
}
