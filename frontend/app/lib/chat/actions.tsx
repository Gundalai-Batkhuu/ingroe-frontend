import 'server-only'
import { ApiEndpoint, DocumentId } from '@/app/enums'
import { createAI, getMutableAIState, getAIState } from 'ai/rsc'
import { BotMessage, UserMessage } from '../../components/chat/message'
import { nanoid } from '../../lib/utils'
import { saveChat } from '@/app/components/chat/actions'
import { Chat, Message } from '../../lib/types'
import { auth } from '@/auth'


async function submitUserMessage(content: string, documentId: string) {
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

    // Prepare the request payload
    const payload = {
      query: content,
      document_id: documentId
    }

    console.log('Request payload:', payload)

    // Call your custom endpoint
    const response = await fetch(ApiEndpoint.QUERY_DOCUMENT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      console.error(
        'API response not OK:',
        response.status,
        response.statusText
      )
      const responseText = await response.text()
      console.error('Response body:', responseText)

      let errorMessage = `Failed to query document: ${response.status} ${response.statusText}`
      if (response.status === 422) {
        errorMessage +=
          '. The server was unable to process the request. This might be due to invalid input data.'
      }

      throw new Error(errorMessage)
    }

    const data = await response.json()
    console.log('API response data:', data)

    // Use the entire API response as the assistant's message
    const assistantMessage = JSON.stringify(data)

    // Add the assistant's response to the state
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
