'use client'

import { Button } from '@/components/ui/button'
import { useDictionary } from '@/hooks'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export default function ErrorBoundary({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  if (error) console.error(error)

  const [isPending, startTransition] = useTransition()
  const { common: dict } = useDictionary()

  const router = useRouter()
  const reload = () => {
    startTransition(() => {
      router.refresh()
      reset()
    })
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 text-center">
      <AlertCircle className="text-destructive h-5 w-5" />
      <h2 className="text-destructive text-xl font-semibold">
        {dict.errors.actionFailed}
      </h2>
      <Button
        variant="outline"
        onClick={reload}
        className="mt-2 cursor-pointer"
      >
        {isPending ? dict.status.loading : dict.actions.tryAgain}
      </Button>
    </div>
  )
}
