import 'server-only'

import { ApiEndpoint } from '@/services/api_endpoints'
import { createAI, getMutableAIState, getAIState } from 'ai/rsc'
import { BotMessage, UserMessage } from '@/features/chat/components/message'
import { nanoid } from '@/lib/utils'
import { saveChat } from '@/features/chat/actions/server-actions'
import { Chat, Message, QueryDocument } from '@/lib/types'
import { auth } from '@/features/authentication/auth'
import { documentService } from '@/services/document-service'


async function submitUserMessage(content: string, documentId: string, quickSearchMode: boolean) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  console.log('Sending the message: ', content)
  console.log('Document ID: ', documentId)

  if (!documentId) {
    throw new Error(
      'Document ID is missing. Please ensure a document is selected.'
    )
  }

  try {
    // Add the user message to the state
    aiState.update({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: 'user',
          content
        }
      ]
    })

    const payload = {
      query: content,
      document_id: documentId
    }

    console.log('Request payload:', payload)

    let data;

    if (quickSearchMode) {
      data = await documentService.queryDocumentQuick(payload)
    } else {
      data = await documentService.queryDocument(payload)
    }

    console.log('API response data:', data)

    const assistantMessage = data.response

    aiState.update({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: 'assistant',
          content: assistantMessage
        }
      ]
    })

    // Return the UI representation of the assistant's message
    return {
      id: nanoid(),
      display: <BotMessage content={assistantMessage} />
    }
  } catch (error) {
    console.error('Error in submitUserMessage:', error)

    // Define a type for the error
    type AppError = {
      message: string
    }

    // Update the AI state with an error message
    aiState.update({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: 'assistant',
          content: `An error occurred: ${(error as AppError).message}`
        }
      ]
    })

    // Return an error message to be displayed in the UI
    return {
      id: nanoid(),
      display: (
        <BotMessage
          content={`An error occurred: ${(error as AppError).message}`}
        />
      )
    }
  }
}


export type AIState = {
  chatId: string
  messages: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  onGetUIState: async () => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const aiState = getAIState() as Chat

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState)
        return uiState
      }
    } else {
      return
    }
  },
  onSetAIState: async ({ state }) => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const { chatId, messages } = state

      const createdAt = new Date()
      const userId = session.user.id as string
      const path = `/chat/${chatId}`

      const firstMessageContent = (messages[0]?.content as string) || ''
      const title = firstMessageContent.substring(0, 100)

      const chat: Chat = {
        id: chatId,
        title,
        userId,
        createdAt,
        messages,
        path
      }

      try {
        await saveChat(chat)
      } catch (error) {
        console.error('Error saving chat:', error)
        // Handle the error appropriately (e.g., show an error message to the user)
      }
    }
  }
})

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'user' ? (
          <UserMessage>{message.content as string}</UserMessage>
        ) : message.role === 'assistant' &&
          typeof message.content === 'string' ? (
          <BotMessage content={message.content} />
        ) : null
    }))
}
