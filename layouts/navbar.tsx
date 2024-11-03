'use client'

import Link from 'next/link'
import AppLogo from '@/components/icons'
import {
  Home,
  LineChart,Package,
  Package2,
  PanelLeft,
  ShoppingCart,
  Users2,
  ChevronsLeft,
  ChevronsRight,
  LayoutGrid
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { SettingsMenu } from '@/features/application-settings/settings-menu'
import { useNavbar } from '@/hooks/use-navbar'
import NavbarItems from './navbar-items'
import { HelpCenter } from '@/features/application-settings/help-center'
import { ThemeSwitch } from '@/features/application-settings/theme-switch'
import { DashboardButton } from '@/features/application-settings/dashboard-button'

export function DesktopNavbar() {
  const { isNavbarExpanded, toggleNavbar } = useNavbar()

  return (
    <aside className={`border-r bg-background ease-in-out duration-300 ${isNavbarExpanded ? 'w-56' : 'w-14'}`}>
      <nav className="flex flex-col h-screen items-center gap-4 overflow-hidden px-2">
        <div className="flex items-center gap-2 justify-start w-full h-14 relative ml-4 mt-2">
          <AppLogo className={`${!isNavbarExpanded && 'hidden'}`} />
          <span className={`text-2xl font-semibold text-brand-green ${!isNavbarExpanded && 'hidden'}`}>
            Ingroe
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-1/2 -translate-y-1/2 size-8"
            onClick={toggleNavbar}
          >
            {isNavbarExpanded ? <ChevronsLeft className="size-6 text-muted-foreground" /> : <ChevronsRight className="size-6 text-muted-foreground" />}
          </Button>
        </div>
        <DashboardButton isNavbarExpanded={isNavbarExpanded} />
        <NavbarItems isNavbarExpanded={isNavbarExpanded} toggleNavbar={toggleNavbar} />
        <div className="flex flex-col gap-4 mt-auto mb-4 w-full">
          <HelpCenter isNavbarExpanded={isNavbarExpanded} toggleNavbar={toggleNavbar} />
          <SettingsMenu isNavbarExpanded={isNavbarExpanded} toggleNavbar={toggleNavbar} />
          <div className="w-full flex justify-center">
            <ThemeSwitch isNavbarExpanded={isNavbarExpanded}/>
          </div>
        </div>
      </nav>
    </aside>
  );
}

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="#"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Vercel</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Home className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <ShoppingCart className="h-5 w-5" />
            Orders
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-foreground"
          >
            <Package className="h-5 w-5" />
            Products
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Users2 className="h-5 w-5" />
            Customers
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <LineChart className="size-5" />
            Settings
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function DashboardBreadcrumb() {
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="#">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="#">Products</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>All Products</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
