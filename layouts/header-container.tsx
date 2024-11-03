'use client'

import React, { ReactNode } from 'react'

export default function HeaderContainer({ slot }: { slot: ReactNode }) {

  return (
    <header
      className={`sticky top-0 z-30 flex h-14 items-center justify-between border-b sm:static 
        sm:h-auto sm:border-0 sm:bg-transparent sm:px-6`}
    >
      {slot}
    </header>
  )
}
