'use client'

import { SWRConfig } from 'swr'

export function SWRConfigProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (
          resource: string | URL | globalThis.Request,
          init?: RequestInit
        ) => fetch(resource, init).then(res => res.json())
      }}
    >
      {children}
    </SWRConfig>
  )
}
