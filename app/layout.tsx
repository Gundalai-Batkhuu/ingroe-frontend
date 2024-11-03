import { Analytics } from '@vercel/analytics/react'
import { Providers } from '@/components/providers'
import { DesktopNavbar, MobileNav } from '@/layouts/navbar' 
import { Toaster } from '@/components/ui/toaster'
import '@/public/globals.css'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import React from 'react'
import HeaderContainer from '@/layouts/header-container'
import MainArea from '@/layouts/main'
import HeaderContent from '@/layouts/header-content'
import { Manrope } from 'next/font/google'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
})

export const metadata = {
  title: 'Ingroe',
  description: 'You gateway to organised knowledge'
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  
  return (
    <html lang="en" className={`${manrope.variable}`} suppressHydrationWarning>
      <body>
        <Providers
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen w-full bg-muted/40">
            <DesktopNavbar />
            <div className="flex flex-col h-full sm:gap-4 sm:py-4 sm:pl-14">
              <HeaderContainer slot={<HeaderContent />} />
              <MainArea>
                {children}
              </MainArea>
            </div>
            <Analytics />
          </div>
          <TailwindIndicator />
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}
