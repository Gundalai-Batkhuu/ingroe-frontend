import { auth } from '@/features/authentication/auth'
import { ChatHistory } from '@/features/chat/components/chat-history'
import { ChatSidebar } from "@/features/chat/components/chat-sidebar"

export async function SidebarChatHistory() {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  return (
    <ChatSidebar className="peer absolute inset-y-0 left-0 z-30 hidden -translate-x-full border-r bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] xl:w-[300px]">
      {/* @ts-ignore */}
      <ChatHistory userId={session.user.id} />
    </ChatSidebar>
  )
}