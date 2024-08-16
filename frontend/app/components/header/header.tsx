import Link from 'next/link';
import {Session} from '../../lib/types'
import {auth} from '@/auth'
import {SidebarToggle} from '../sidebar-toggle'
import {UserMenu} from '@/app/components/user-menu'
import {Button} from '../ui/button'

async function UserOrLogin() {
    const session = (await auth()) as Session

    return (
        <>
            {session?.user ? (
                <div className="flex items-center">
                    <UserMenu user={session.user}/>
                </div>
            ) : (
                <>
                    <Link href="/login">
                        <Button variant="ghost">
                            Login
                        </Button>
                    </Link>
                    <Link href="/signup">
                        <Button variant="ghost">
                            Sign Up
                        </Button>
                    </Link>
                </>
            )}
        </>
    )
}

export function Header() {
    return (
        <header
            className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
            <div className="flex items-center">
                <SidebarToggle/>
                <Link href="/frontend/public" className="text-xl font-bold">
                    Legal AI
                </Link>

            </div>
            <div className="flex items-center justify-end space-x-6">
                <UserOrLogin/>
            </div>
        </header>
    )
}
