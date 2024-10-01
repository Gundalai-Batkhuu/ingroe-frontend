import React from 'react'
import { ChatHistoryContainer } from '@/features/chat/components/chat-history-container'
import { ExistingDocumentViewerContainer } from '@/features/chat/components/existing-document-viewer-container'

interface ChatLayoutProps {
  children: React.ReactNode
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
      <ChatHistoryContainer />
      <main className="flex-1 overflow-hidden">{children}</main>
      <ExistingDocumentViewerContainer />
    </div>
  )
}