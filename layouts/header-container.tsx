'use client'

import React, { ReactNode } from 'react'
import { usePathname } from 'next/navigation'


export default function HeaderContainer({ slot }: { slot: ReactNode }) {
	const pathname = usePathname()

  return (
    <header
      className={`sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-6 ${
        pathname.startsWith('/chat') 
          ? 'w-[75%] ml-[25%] lg:w-[80%] lg:ml-[20%] xl:w-[85%] xl:ml-[15%]' 
          : ''
      }`}
    >
      {slot}
    </header>
  )
}
