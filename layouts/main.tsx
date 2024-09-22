import { useState } from 'react'
import Sidebar from '@/layouts/sidebar'
import Content from '@/layouts/content'

const Main = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isSidebarOpen={isSidebarOpen} isMobileMenuOpen={isMobileMenuOpen} />
      <Content />
    </div>
  )
}

export default Main