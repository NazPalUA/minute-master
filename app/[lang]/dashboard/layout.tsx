import { DashboardHeader } from '@/components/dashboard-header'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { TimerDialog, TimerFallback } from '@/components/timer-dialog'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { SWRConfigProvider } from '@/lib/context/swr-config-provider'
import { Language } from '@/localization'
import { cookies } from 'next/headers'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Suspense } from 'react'

// export const experimental_ppr = true

export default async function DashboardLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode
  timer: React.ReactNode
  params: Promise<{ lang: Language }>
}>) {
  const { lang } = await params

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false'

  return (
    <SWRConfigProvider>
      <NuqsAdapter>
        <SidebarProvider defaultOpen={defaultOpen} className="max-w-[1920px]">
          <DashboardSidebar lang={lang} />
          <div className="flex h-full min-h-screen w-full flex-col">
            <DashboardHeader lang={lang} />
            <div className="flex h-full flex-grow flex-col space-y-6 px-4 pb-6">
              {children}
            </div>
            <Suspense fallback={<TimerFallback />}>
              <TimerDialog />
            </Suspense>
            <Toaster />
          </div>
        </SidebarProvider>
      </NuqsAdapter>
    </SWRConfigProvider>
  )
}
