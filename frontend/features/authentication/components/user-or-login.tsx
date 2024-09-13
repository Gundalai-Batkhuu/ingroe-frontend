'use server'

import { auth } from '@/features/authentication/auth'
import { Session } from '@/lib/types'
import { UserMenu } from '@/features/authentication/components/user-menu'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export async function UserOrLogin() {
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