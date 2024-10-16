'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { NavbarProvider } from '@/hooks/use-navbar'
import { TooltipProvider } from './tooltip'

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <NavbarProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </NavbarProvider>
    </NextThemesProvider>
  )
}
