import { MobileNav } from '@/layouts/navbar'
import { SearchInput } from '@/features/document-collection/components/search'
import { UserMenu } from '@/features/authentication/components/user-menu'
import React from 'react'
import { DynamicBreadcrumb } from '@/layouts/breadcrumb'

export default function HeaderContent() {
  return (
    <>
      <div className='flex items-center gap-4'>
        <MobileNav />
        <DynamicBreadcrumb />
      </div>
      <UserMenu />
    </>
  )
}
