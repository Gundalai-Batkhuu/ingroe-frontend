export function EmptyScreen() {
  return (
    <div className="flex-1 mx-auto max-w-2xl p-4">
      <div className="rounded-lg border p-8 bg-background">
        <h1 className="text-lg font-semibold">Welcome to AI Chatbot!</h1>
        <p className="mt-2 text-muted-foreground">
          Get started by selecting a document and typing your message below.
        </p>
      </div>
    </div>
  )
}
