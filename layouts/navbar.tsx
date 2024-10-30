'use client'

import { useState } from 'react'
import Link from 'next/link'
import AppLogo from '@/components/icons'
import { NavItem } from '@/features/document-collection/components/nav-item'
import {
  Database,
  Home,
  LineChart,
  MessageSquareMore, Package,
  Package2,
  PanelLeft,
  ShoppingCart,
  Store,
  Users2,
  FilePlus, Search,
  ChevronRight,
  ChevronLeft
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

export function DesktopNav() {
  const { isNavbarExpanded, toggleNavbar } = useNavbar()

  return (
    <aside className={`fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-background transition-all duration-300 ease-in-out sm:flex ${isNavbarExpanded ? 'w-56' : 'w-14'}`}>
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-2 overflow-hidden">
        <div className="flex items-center justify-center w-14 h-14">
        <Button
        variant="ghost"
        size="icon"
        className="absolute left-2.5 top-2 z-30"
        onClick={toggleNavbar}
      >
        {isNavbarExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
        </div>

        <NavItem href="/" label="Home">
          <Home className="h-5 w-5" />
        </NavItem>

        <NavItem href="/databases" label="Databases">
          <Database className="h-5 w-5" />
        </NavItem>

        <NavItem href="/create-worker" label="New worker">
          <FilePlus className="h-5 w-5" />
        </NavItem>

        <NavItem href="/chat" label="Chat">
          <MessageSquareMore className="size-5" />
        </NavItem>

        <NavItem href="/database-market" label="Store">
          <Store className="h-5 w-5" />
        </NavItem>

        <NavItem href="/customers" label="Customers">
          <Users2 className="h-5 w-5" />
        </NavItem>

        <NavItem href="#" label="Analytics">
          <LineChart className="h-5 w-5" />
        </NavItem>
      </nav>
      <nav className="mt-auto flex flex-col gap-4 pl-3 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex h-9 w-9 items-center rounded-lg text-muted-foreground transition-colors 
            hover:text-foreground md:h-8 md:w-8">
              <SettingsMenu/>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
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
