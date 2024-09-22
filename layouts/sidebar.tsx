import React, { useState } from 'react'

interface SidebarProps {
  isSidebarOpen?: boolean
  isMobileMenuOpen?: boolean
}

export default function Sidebar({
  isSidebarOpen,
  isMobileMenuOpen
}: SidebarProps) {

  return (
    <aside
      className={`bg-white w-64 flex flex-col border-r transition-all duration-300 h-screen ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isMobileMenuOpen ? 'block' : 'hidden'} lg:block lg:relative lg:translate-x-0`}
    >
      {/* Sidebar Header */}
      <div className="p-2 h-16 flex items-center font-bold text-xl bg-[hsl(var(--nav-bg))]">
        <h2 className={'text-lg'}>Chat History</h2>
      </div>
      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto p-4 h-full bg-[hsl(var(--sidebar-bg))]">
        <p className={'text-primary'}>Sidebar content</p>
      </div>
    </aside>
  )
}
