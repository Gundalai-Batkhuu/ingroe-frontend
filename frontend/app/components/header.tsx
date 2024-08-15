import Link from 'next/link';
import {UserNameDisplay} from './username-display'
import {SignOut} from "@/app/components/signout";
import {Session} from '../lib/types'
import {auth} from '@/auth'
import { SidebarToggle } from './sidebar-toggle'

async function UserOrLogin() {
    const session = (await auth()) as Session
    return (
        <>
            {session?.user ? (
                <>
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        Welcome, <UserNameDisplay/>!
                    </div>
                    <div>
                        <SignOut/>
                    </div>
                </>
            ) : (
                <>
                    <Link href="/login" className="relative text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:text-zinc-700 dark:hover:text-zinc-300">
                        Log In
                    </Link>
                    <Link href="/signup" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        Sign Up
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
                <SidebarToggle />
                <Link href="/" className="text-xl font-bold">
                    Legal AI
                </Link>
            </div>
            <div className="flex items-center justify-end space-x-6">
                    <UserOrLogin/>
            </div>
        </header>
    )
}
