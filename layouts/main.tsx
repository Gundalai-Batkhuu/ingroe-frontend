'use client'

import React from 'react'

const MainArea = ({ children }: { children: React.ReactNode }) => {

  return (
    <div 
      className={`h-[calc(100%-3.5rem)] overflow-y-auto px-4 pt-4 pb-4`}
    >
      {children}
    </div>
  )
}

export default MainArea