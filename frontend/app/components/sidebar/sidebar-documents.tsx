import React from 'react'
import {useSidebar} from "@/app/lib/hooks/use-sidebar";
import {cn} from "@/app/lib/utils";

export interface SidebarProps extends React.ComponentProps<'div'> {}

export function SidebarDocuments({
                                  className
                              }: SidebarProps) {
    const {isSidebarOpen, isLoading} = useSidebar()

    return (
        <div
            className={cn(
                className,
                'h-full flex-col dark:bg-zinc-950',
                isSidebarOpen && !isLoading ? 'translate-x-0' : 'translate-x-full',
                'transition-transform duration-300 ease-in-out'
            )}
        >
            <div
                className="flex flex-col h-full inset-y-0 border-l lg:w-[250px] xl:w-[300px] bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl overflow-hidden">
                <div className="w-full h-full overflow-y-auto">
                  <div className="w-full max-w-md p-4 space-y-5">
                    {/* Your sidebar content goes here */}
                  </div>
                </div>
            </div>
        </div>
    )
}