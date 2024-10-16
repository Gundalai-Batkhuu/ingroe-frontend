'use client'

import * as React from 'react'

interface NavbarContext {
  isNavbarExpanded: boolean
  toggleNavbar: () => void
}

const NavbarContext = React.createContext<NavbarContext | undefined>(undefined)

export function useNavbar() {
  const context = React.useContext(NavbarContext)
  if (!context) {
    throw new Error('useNavbar must be used within a NavbarProvider')
  }
  return context
}

interface NavbarProviderProps {
  children: React.ReactNode
}

export function NavbarProvider({ children }: NavbarProviderProps) {
  const [isNavbarExpanded, setNavbarExpanded] = React.useState(false)

  const toggleNavbar = () => {
    setNavbarExpanded(prevState => !prevState)
  }

  return (
    <NavbarContext.Provider
      value={{ isNavbarExpanded, toggleNavbar }}
    >
      {children}
    </NavbarContext.Provider>
  )
}
