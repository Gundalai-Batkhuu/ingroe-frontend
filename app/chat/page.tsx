import { nanoid } from '@/lib/utils'
import { Chat } from '@/features/chat/components/chat'
import { AI } from '@/features/chat/actions/ai-actions'
import { auth } from '@/features/authentication/auth'
import { Session } from '@/lib/types'
import { getMissingKeys } from '@/features/chat/actions/server-actions'

export const metadata = {
  title: 'Ingroe',
}

export default async function IndexPage() {
  const id = nanoid()
  const session = (await auth()) as Session
  
  if (!session || !session.user) {
    return <div> Please log in</div>
  }
  
  const missingKeys = await getMissingKeys()
  
  return (
    <div>
      <AI initialAIState={{ chatId: id, messages: [] }}>
        <Chat id={id} session={session} missingKeys={missingKeys} />
      </AI>
    </div>
  )
}


