'use client'

import { useDictionary } from '@/hooks'
import { cn } from '@/lib/utils'

type Props = {
  containerClassName?: string
  className?: string
  noContainer?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export function LoadingSpinner({
  className,
  containerClassName,
  size = 'md',
  noContainer = false
}: Props) {
  const sizeClasses = {
    xs: 'size-4 border-y-1',
    sm: 'size-8 border-y-1',
    md: 'size-12 border-y-2',
    lg: 'size-16 border-y-2',
    xl: 'size-20 border-y-2'
  }

  const { common: dict } = useDictionary()

  return (
    <Container noContainer={noContainer} className={containerClassName}>
      <div
        className={cn(
          'border-secondary-foreground animate-spin rounded-full border-solid border-t-transparent shadow-md',
          sizeClasses[size],
          className
        )}
      />
      <span className="sr-only">{dict.status.loading}</span>
    </Container>
  )
}

type ContainerProps = {
  className?: string
  noContainer: boolean
  children: React.ReactNode
}

export function Container({
  className,
  noContainer,
  children
}: ContainerProps) {
  if (noContainer) return children

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex h-full w-full items-center justify-center',
        className
      )}
    >
      {children}
    </div>
  )
}
