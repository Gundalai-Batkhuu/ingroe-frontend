import { auth } from '@/features/authentication/auth'
import { ChatHistory } from '@/features/chat/components/chat-history'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export async function ChatSidebarContainer() {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  return (
    <aside className="w-96 h-full">
    <Tabs defaultValue="chats" className="flex flex-col justify-between h-full bg-background dark:bg-zinc-950 w-full p-4">
      <TabsList>
        <TabsTrigger value="chats" className="w-1/3 text-md">Chats</TabsTrigger>
        <TabsTrigger value="notes" className="w-1/3 text-md">Notes</TabsTrigger>
        <TabsTrigger value="pinned" className="w-1/3 text-md">Pinned</TabsTrigger>
      </TabsList>
        <TabsContent value="chats" className="h-full mt-8">
          <ChatHistory userId={session.user.id} />
        </TabsContent>
        <TabsContent value="notes" className="h-full mt-8">
          <span>Notes</span>
        </TabsContent>
        <TabsContent value="pinned" className="h-full mt-8">
          <span>Pinned</span>
        </TabsContent>
    </Tabs>
    </aside>
  )
}