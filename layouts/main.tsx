'use client'

import React from 'react'

const MainArea = ({ children }: { children: React.ReactNode }) => {

  return (
    <div 
      className={`h-[calc(100%-3.5rem)] overflow-y-auto`}
    >
      {children}
    </div>
  )
}

export default MainArea