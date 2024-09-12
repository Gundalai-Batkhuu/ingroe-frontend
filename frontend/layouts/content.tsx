import { Button } from '@/components/ui/button'
import { Bell, Mic, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'


export default function Content() {
  const [chatInput, setChatInput] = useState<string>('')
  const handleChatSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    console.log('Chat message submitted:', chatInput)
    setChatInput('')
  }

  return (
      <div className="flex-1 flex flex-col overflow-hidden bg-background">
        {/* Header */}
        <header className="z-10 h-16">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">Main area header</h1>
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Bell className="h-6 w-6" />
                  <span className="sr-only">View notifications</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Content Area</h2>
            <p>This is where your main content goes. It will change based on your application needs.</p>
            <p className="mt-4">The sidebar to the left shows different content based on which icon you select in the
              thin navbar.</p>
          </div>
        </main>

        {/* Chat Interface */}
        <div className="bg-white p-4">
          <form onSubmit={handleChatSubmit} className="flex items-center">
            <Input
              type="text"
              placeholder="Type your message..."
              value={chatInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChatInput(e.target.value)}
              className="flex-grow mr-2 shadow"
            />
            <Button type="button" size="icon" variant="ghost" className="mr-2">
              <Mic className="h-6 w-6" />
              <span className="sr-only">Voice input</span>
            </Button>
            <Button type="submit">
              <Send className="h-6 w-6 mr-2" />
              Send
            </Button>
          </form>
        </div>
      </div>
  )
}