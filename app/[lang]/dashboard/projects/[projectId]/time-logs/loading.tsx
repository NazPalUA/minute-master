import { LoadingSpinner } from '@/components/loading-spinner'

export default function TasksLoading() {
  return (
    <LoadingSpinner
      size="lg"
      containerClassName="mt-6 sm:mt-12 md:mt-16 lg:mt-24 xl:mt-32"
    />
  )
}
