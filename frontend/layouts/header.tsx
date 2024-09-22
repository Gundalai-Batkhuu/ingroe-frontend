import { MobileNav } from '@/layouts/navbar'
import { SearchInput } from '@/features/database-dashboard/components/search'
import { User } from '@/features/authentication/components/user'
import React from 'react'
import { DynamicBreadcrumb } from '@/layouts/breadcrumb'

export default function HeaderLayout() {
  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <MobileNav />
      <DynamicBreadcrumb />
      <SearchInput />
      <User />
    </header>
  )
}

