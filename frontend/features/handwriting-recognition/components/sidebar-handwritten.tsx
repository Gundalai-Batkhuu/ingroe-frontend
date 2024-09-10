import { cn } from '@/utils/utils'
import React from 'react'
import { useSidebar } from '@/hooks/use-sidebar'

interface SidebarHandwrittenProps extends React.ComponentProps<'div'> {
  userId: string
}

export function SidebarHandwritten({ userId, className}: SidebarHandwrittenProps) {
  const {isSidebarOpen, isLoading} = useSidebar()

  return (
    <div
      className={cn(
        className,
        'h-full flex-col dark:bg-zinc-950',
        isSidebarOpen && !isLoading ? 'translate-x-0' : '-translate-x-full',
        'transition-transform duration-300 ease-in-out'
      )}
    >
      <div
        className="flex flex-col h-full inset-y-0 border-r lg:w-[250px] xl:w-[300px] bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl overflow-hidden">
        <div className="size-full overflow-y-auto">
        </div>
      </div>
    </div>
          )


          }