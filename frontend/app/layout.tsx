import { Metadata, Viewport } from 'next'
import { ReactNode } from 'react'
import "./globals.css";
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { cn } from './lib/utils'
import { Providers } from './components/providers'
import { Header } from './components/header'

export const metadata: Metadata = {
    title: "Legal AI",
    description: "Generated by create next app",
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}

interface RootLayoutProps {
    children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en">
        <body
            className={cn(
                'font-sans antialiased',
                GeistSans.variable,
                GeistMono.variable
            )}
        >
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        <div className="flex flex-col min-h-screen">
            <Header/>
            <main className="flex flex-col flex-1 bg-muted/50">{children}</main>
        </div>
            </Providers>
        </body>
        </html>
    );
}