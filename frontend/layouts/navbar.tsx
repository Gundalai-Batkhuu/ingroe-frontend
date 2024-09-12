import { Button } from '@/components/ui/button'
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  Users,
} from 'lucide-react'
import React from 'react'
import Logo from '@/layouts/logo'
import {UserOrLogin} from '@/features/authentication/components/user-or-login'
import { ThemeToggle } from '@/components/theme-toggle'


interface NavbarProps {
  activeSidebar: string
  setActiveSidebar: (sidebar: string) => void
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

export default function Navbar({
  activeSidebar,
  setActiveSidebar,
  isSidebarOpen,
  toggleSidebar
}: NavbarProps) {
  return (
    <nav className="text-white w-16 flex flex-col items-center shrink-0 bg-[hsl(var(--nav-bg))]">
      {/* App Logo */}
      <div className={'mb-8 size8'}>
        <Logo />
      </div>

      {/* Sidebar Toggle Buttons */}
      <div className="flex-1 flex flex-col items-center">
        <Button
          variant="nav"
          size="icon"
          className={`mb-4 ${activeSidebar === 'home' ? 'text-blue-800 bg-blue-200' : ''}`}
          onClick={() => setActiveSidebar('home')}
        >
          <Home className="size-6" />
          <span className="sr-only">Home</span>
        </Button>

        <Button
          variant="nav"
          size="icon"
          className={`mb-4 ${activeSidebar === 'users' ? 'text-blue-800 bg-blue-200' : ''}`}
          onClick={() => setActiveSidebar('users')}
        >
          <Users className="size-6" />
          <span className="sr-only">Users</span>
        </Button>
        <Button
          variant="nav"
          size="icon"
          className={`mb-4 ${activeSidebar === 'settings' ? 'text-blue-800 bg-blue-200' : ''}`}
          onClick={() => setActiveSidebar('settings')}
        >
          <Settings className="size-6" />
          <span className="sr-only">Settings</span>
        </Button>
        <Button
          variant="link"
          size="icon"
          className="mb-4"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? (
            <ChevronLeft className="size-6" />
          ) : (
            <ChevronRight className="size-6" />
          )}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
      {/*<UserOrLogin />*/}

          <ThemeToggle />

    </nav>
  )
}
