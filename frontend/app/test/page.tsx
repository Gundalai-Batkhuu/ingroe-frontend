'use client'

import Navbar from '@/layouts/navbar'
import { useState } from 'react'
import Main from '@/layouts/main'

export default function LayoutPage() {
  const [activeSidebar, setActiveSidebar] = useState<string>('home')
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)

  return (
    <div className="flex min-h-screen">
      <Navbar  activeSidebar={activeSidebar}
                setActiveSidebar={setActiveSidebar}
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <Main />

    </div>
  )
}