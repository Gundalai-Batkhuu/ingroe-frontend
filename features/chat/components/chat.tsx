'use client'

import { cn } from '@/lib/utils'
import { ChatList } from './chat-list'
import { ChatPanel } from './chat-panel'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { useEffect, useState } from 'react'
import { useUIState, useAIState } from 'ai/rsc'
import { Message, Session } from '@/lib/types'
import { usePathname, useRouter } from 'next/navigation'
import { useScrollAnchor } from '@/hooks/use-scroll-anchor'
import { useToast } from '@/components/hooks/use-toast'
import { ScrollArea } from '@/components/ui/scroll-area'
import { EmptyScreen } from '@/features/chat/components/empty-screen'

export interface ChatProps extends React.ComponentProps<'div'> {
    initialMessages?: Message[]
    id?: string
    session?: Session
    missingKeys: string[]
}

export function Chat({ id, className, session, missingKeys }: ChatProps) {
    const router = useRouter()
    const path = usePathname()
    const [input, setInput] = useState('')
    const [messages] = useUIState()
    const [aiState] = useAIState()
    const { toast } = useToast()

    const [_, setNewChatId] = useLocalStorage('newChatId', id)

    useEffect(() => {
        if (session?.user && path) {
            if (!path.includes('chat') && messages.length === 1) {
                window.history.replaceState({}, '', `/chat/${id}`)
            }
        }
    }, [id, path, session?.user, messages])

    useEffect(() => {
        const messagesLength = aiState.messages?.length
        if (messagesLength === 2) {
            router.refresh()
        }
    }, [aiState.messages, router])

    useEffect(() => {
        setNewChatId(id)
    })

    useEffect(() => {
        missingKeys.forEach(key => {
            toast({
                variant: "destructive",
                title: "Configuration Error",
                description: `Missing ${key} environment variable!`,
            })
        })
    }, [missingKeys, toast])

    const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
        useScrollAnchor()

    return (
        <div className="flex flex-col h-full w-full">

            {/* Message Area - always at top, takes remaining space */}
                {messages.length ? (
                    <ScrollArea className="flex-1 group w-full overflow-auto"
                        ref={scrollRef}
                    >
                        <div className={cn('pb-[200px] pt-4 md:pt-10', className)}
                            ref={messagesRef}
                        >
                            <ChatList messages={messages} isShared={false} session={session} />
                        </div>
                    </ScrollArea>
                ) : (
                    <EmptyScreen />
                )}

            {/* Chat Panel - always at bottom */}
            <ChatPanel
                input={input}
                setInput={setInput}
            />
        </div>
    )
}
