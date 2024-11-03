'use client'

import React from 'react'

const MainArea = ({ children }: { children: React.ReactNode }) => {

  return (
    <div 
      className={`h-full overflow-y-hidden px-4 pt-4`}
    >
      {children}
    </div>
  )
}

export default MainArea