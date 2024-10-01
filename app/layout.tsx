import { Analytics } from '@vercel/analytics/react'
import { Providers } from '@/components/providers'
import { DesktopNav, MobileNav, DashboardBreadcrumb } from '@/layouts/navbar'
import { cn } from '@/lib/utils'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Toaster } from '@/components/ui/toaster'
import '@/public/globals.css'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { ThemeToggle } from '@/components/theme-toggle'
import React from 'react'
import HeaderLayout from '@/layouts/header'

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'font-sans antialiased',
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <Providers
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex flex-col min-h-screen w-full bg-muted/40">
            <DesktopNav />
            <div className="flex flex-col h-full sm:gap-4 sm:py-4 sm:pl-14">
              <HeaderLayout />
              <main className="relative grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40 overflow-auto">
                {children}
                <div className="fixed bottom-4 right-4 z-50">
                  <ThemeToggle />
                </div>
              </main>
            </div>
            <Analytics />
          </main>
          <TailwindIndicator />
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}
