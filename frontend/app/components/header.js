import * as React from 'react'

export default function Header() {
    return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        <a href="/" className="text-xl font-bold">Legal AI</a>
      </div>
      <div className="flex items-center justify-end space-x-6">
        <a href="/login" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Log In</a>
        <a href="/signup" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Sign Up</a>
      </div>
    </header>
    )
}