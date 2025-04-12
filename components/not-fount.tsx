import { cn } from '@/lib/utils'
import { FolderSearch } from 'lucide-react'

type Props = {
  title: string
  description?: string
  icon?: React.ReactNode
  className?: string
}

export function NotFount({
  className,
  title,
  icon = <FolderSearch className="text-muted-foreground h-8 w-8" />,
  description
}: Props) {
  return (
    <div
      className={cn(
        'flex min-h-[260px] flex-col items-center justify-center p-8 text-center',
        className
      )}
    >
      <div className="bg-muted mb-4 rounded-full p-4">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      {description && (
        <p className="text-muted-foreground max-w-md text-sm">{description}</p>
      )}
    </div>
  )
}
