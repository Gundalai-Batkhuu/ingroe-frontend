
export default async function ChatLayout({ children }) {
  return (
    <div className="flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
      {children}
    </div>
  )
}