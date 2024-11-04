import { MobileNav } from '@/layouts/navbar'
import { SearchInput } from '@/features/workers-collection/components/search'
import { UserMenu } from '@/features/authentication/components/user-menu'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Mail, MessageSquareText } from 'lucide-react'

export default function HeaderContent() {
  return (
    <>
      <div className='flex items-center gap-4'>
        <SearchInput />
        <MobileNav />
        <Button variant="ghost">
          Documents
        </Button>
        <Button variant="ghost">
          Service Hub
        </Button>
        <Button variant="ghost">
          Reports
        </Button>
      </div>
      <div className='flex items-center gap-6'>
        <Mail className='size-5 text-muted-foreground' />
        <MessageSquareText className='size-5 text-muted-foreground' />
        <UserMenu />
      </div>
    </>
  )
}
