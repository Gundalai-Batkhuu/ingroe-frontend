'use client'

import {useFormState, useFormStatus} from 'react-dom'
import {authenticate} from '@/features/authentication/actions/user-actions'
import Link from 'next/link'
import {useEffect, useState} from 'react'
import {getMessageFromCode} from '@/lib/utils'
import {useRouter} from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useToast } from "@/components/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export function LoginForm() {
    const router = useRouter()
    const { toast } = useToast()
    const [result, formAction] = useFormState(authenticate, undefined)
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (result) {
            if (result.type === 'error') {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: getMessageFromCode(result.resultCode)
                })
            } else {
                toast({
                    title: "Success",
                    description: getMessageFromCode(result.resultCode)
                })
                setTimeout(() => {
                    router.push('/workers')
                    router.refresh()
                }, 1000)
            }
        }
    }, [result, router, toast])

    return (
        <>
            <form
                action={formAction}
                className="flex flex-col items-center gap-4 space-y-3"
            >
                <div
                    className="w-full flex-1 rounded-lg border bg-white px-6 pb-4 pt-8 shadow-md  md:w-96 dark:bg-zinc-950">
                    <h1 className="mb-3 text-2xl font-bold">Please log in to continue.</h1>
                    <div className="w-full">
                        <div>
                            <label
                                className="mb-3 mt-5 block text-xs font-medium text-zinc-400"
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    className="peer block w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email address"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label
                                className="mb-3 mt-5 block text-xs font-medium text-zinc-400"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    className="peer block w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div className="mt-4 flex items-center">
                                <input
                                    id="show-password"
                                    type="checkbox"
                                    onChange={() => setShowPassword((prev) => !prev)}
                                    className="h-4 w-4 rounded border-zinc-600 text-zinc-600 focus:ring-zinc-500"
                                />
                                <label htmlFor="show-password" className="ml-2 block text-sm text-zinc-500">
                                    Show password
                                </label>
                            </div>
                        </div>
                    </div>
                    <LoginButton/>
                </div>

                <Link
                    href="/signup"
                    className="flex flex-row gap-1 text-sm text-zinc-400"
                >
                    No account yet? <div className="font-semibold underline">Sign up</div>
                </Link>
            </form>
            <Toaster />
        </>
    )
}

function LoginButton() {
    const {pending} = useFormStatus()

    return (
        <button
            className="my-4 flex h-10 w-full flex-row items-center justify-center rounded-md bg-zinc-900 p-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            aria-disabled={pending}
        >
            {pending ? <Loader2 className="size-4 animate-spin" /> : 'Log in'}
        </button>
    )
}