import { MobileNav } from '@/layouts/navbar'
import { SearchInput } from '@/features/workers-collection/components/search'
import { UserMenu } from '@/features/authentication/components/user-menu'
import React from 'react'

export default function HeaderContent() {
  return (
    <>
      <div className='flex items-center gap-4'>
        <SearchInput />
        <MobileNav />
      </div>
      <UserMenu />
    </>
  )
}
