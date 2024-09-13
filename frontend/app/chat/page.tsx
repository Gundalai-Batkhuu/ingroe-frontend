import { nanoid } from '@/utils/utils'
import { Chat } from '@/features/chat/components/chat'
import { AI } from '@/features/chat/actions/ai-actions'
import { auth } from '@/features/authentication/auth'
import { Session } from '@/lib/types'
import { getMissingKeys } from '@/features/chat/actions/server-actions'

export const metadata = {
  title: 'Legal AI Chatbot'
}

export default async function IndexPage() {
  const id = nanoid()
  const session = (await auth()) as Session
  const missingKeys = await getMissingKeys()
  
  return (
    <div>
      <AI initialAIState={{ chatId: id, messages: [] }}>
        <Chat id={id} session={session} missingKeys={missingKeys} />
      </AI>
    </div>
  )
}
