'use client'

import React from 'react'
import { useNavbar } from '@/hooks/use-navbar'

const MainArea = ({ children }: { children: React.ReactNode }) => {
  const { isNavbarExpanded } = useNavbar()

  return (
    <div 
      className={`relative grid flex-1 items-start gap-2 p-2 bg-muted/40 overflow-auto transition-all duration-300 ease-in-out
        ${isNavbarExpanded ? 'pl-44' : ''}
      `}
    >
      {children}
    </div>
  )
}

export default MainArea