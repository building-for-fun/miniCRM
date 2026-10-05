'use client'

import { Providers } from '@/components/Providers'
import { CrmProvider } from '@/context/CrmContext'
import Dashboard from '@/components/Dashboard'

export default function Home() {
  return (
    <Providers>
      <CrmProvider>
        <Dashboard />
      </CrmProvider>
    </Providers>
  )
}
