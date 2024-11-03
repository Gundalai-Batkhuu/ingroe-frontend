"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Label } from "@/components/ui/label"
import { Moon, Sun } from "lucide-react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"
import { Button } from '@/components/ui/button'

export function ThemeToggleCompact() {
  const { setTheme, theme } = useTheme()
  const [_, startTransition] = React.useTransition()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="group hover:text-brand-green"
      onClick={() => {
        startTransition(() => {
          setTheme(theme === 'light' ? 'dark' : 'light')
        })
      }}
    >
      {!theme ? null : theme === 'dark' ? (
        <Moon className="transition-all size-5 text-muted-foreground group-hover:text-brand-green" />
      ) : (
        <Sun className="transition-all size-5 text-muted-foreground group-hover:text-brand-green" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

const ThemeToggleExpanded = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, checked, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer group inline-flex h-7 w-[9.75rem] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-slate-200 shadow-sm transition-colors hover:text-brand-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-slate-800",
      className
    )}
    checked={checked}
    {...props}
    ref={ref}
  >
    <div className="relative flex h-full w-full items-center justify-between px-1">
      <div className="flex items-center gap-1 pl-3.5">
        <Sun className="size-3.5 text-muted-foreground transition-colors group-hover:text-brand-green" />
        <span className="text-xs font-bold text-muted-foreground">Light</span>
      </div>
      <div className="flex items-center gap-1 pr-3.5">
        <span className="text-xs font-bold text-muted-foreground">Dark</span>
        <Moon className="size-3.5 text-muted-foreground transition-colors group-hover:text-brand-green" />
      </div>
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none absolute flex h-6 w-[5rem] left-0 items-center justify-center rounded-full shadow-lg transition-transform duration-300 data-[state=checked]:translate-x-[4.5rem] data-[state=unchecked]:translate-x-0",
          checked ? "bg-slate-900" : "bg-white"
        )}
      >
        {checked ? (
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-slate-200">Dark</span>
            <Moon className="size-3.5 text-slate-200 transition-colors group-hover:text-brand-green" />
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Sun className="size-3.5 text-primary transition-colors group-hover:text-brand-green" />
            <span className="text-xs font-bold text-primary">Light</span>
          </div>
        )}
      </SwitchPrimitives.Thumb>
    </div>
  </SwitchPrimitives.Root>
))
ThemeToggleExpanded.displayName = "ThemeToggleExpanded"

interface ThemeSwitchProps {
    isNavbarExpanded: boolean
}


export function ThemeSwitch({ isNavbarExpanded }: ThemeSwitchProps) {
  const { setTheme, theme } = useTheme()
  const [_, startTransition] = React.useTransition()

  if (!isNavbarExpanded) {
    return (
      <ThemeToggleCompact />
    )
  }

  return (
    <div className="flex items-center">
      <ThemeToggleExpanded
        id="theme-mode"
        checked={theme === 'dark'}
        onCheckedChange={(checked) => {
          startTransition(() => {
            setTheme(checked ? 'dark' : 'light')
          })
        }}
      />
      <Label htmlFor="theme-mode" className="sr-only">Dark Mode</Label>
    </div>
  )
}
