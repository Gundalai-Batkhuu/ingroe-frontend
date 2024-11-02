'use client'

import React, { ReactNode } from 'react'
import { useNavbar } from '@/hooks/use-navbar'

export default function HeaderLayout({ slot }: { slot: ReactNode }) {
  const { isNavbarExpanded } = useNavbar()

  return (
    <header
      className={`sticky top-0 z-30 flex h-14 items-center justify-between border-b sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 
        transition-all duration-300 ease-in-out ${isNavbarExpanded ? 'sm:pl-48' : ''}
      `}
    >
      {slot}
    </header>
  )
}
