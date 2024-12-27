import * as React from 'react'
import { userArtifactsStore } from '@/stores/userArtifactsStore'
import { PromptForm } from './prompt-form'
import { useUIState, useActions } from 'ai/rsc'
import type { AI } from '@/features/chat/actions/ai-actions'
import { nanoid } from 'nanoid'
import { UserMessage } from './message'

export interface ChatPanelProps {
  input: string
  setInput: (value: string) => void
}

export function ChatPanel({
  input,
  setInput
}: ChatPanelProps) {
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()
  const selectedDocumentId = userArtifactsStore(
    state => state.selectedArtifactId
  )

  const handleSubmitMessage = async (message: string) => {
    setMessages(currentMessages => [
      ...currentMessages,
      {
        id: nanoid(),
        display: <UserMessage>{message}</UserMessage>
      }
    ])

    const responseMessage = await submitUserMessage(
      message,
      selectedDocumentId
    )

    setMessages(currentMessages => [...currentMessages, responseMessage])
  }

  return (
    <div className="flex w-full px-4 py-4">
      <div className="w-full max-w-4xl mx-auto bg-background p-4 shadow-lg rounded-xl">
        <PromptForm
          input={input}
          setInput={setInput}
          onSubmit={handleSubmitMessage}
        />
      </div>
    </div>
  )
}
