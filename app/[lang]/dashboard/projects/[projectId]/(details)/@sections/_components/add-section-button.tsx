import { SectionFormDialog } from '@/components/create-section-dialog'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

export function AddSectionButton({ children }: { children: React.ReactNode }) {
  return (
    <SectionFormDialog>
      <Button size="sm">
        <PlusIcon className="mr-2 h-4 w-4" />
        {children}
      </Button>
    </SectionFormDialog>
  )
}
