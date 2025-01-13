'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { signup } from '@/features/authentication/actions/user-actions';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { getMessageFromCode } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { signInWithGoogle } from '@/features/authentication/actions/user-actions';
import Logo from '@/layouts/logo';

export default function SignupForm() {
	const router = useRouter();
	const { toast } = useToast();
	const [result, formAction] = useFormState(signup, undefined);
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		if (result) {
			if (result.type === 'error') {
				toast({
					variant: 'destructive',
					title: 'Error',
					description: getMessageFromCode(result.resultCode)
				});
			} else {
				toast({
					title: 'Success',
					description: getMessageFromCode(result.resultCode)
				});
				router.refresh();
				router.push('/workers');
			}
		}
	}, [result, router]);

	return (
		<>
			<form action={formAction} className="flex flex-col items-center gap-4">
				<div className="w-full flex-1 justify-center px-6 pb-4 dark:bg-zinc-950 md:w-96">
					<div className="flex flex-row items-center justify-center mb-8">
						<Logo />
					</div>

					<h1 className="mb-6 text-2xl font-semibold text-center">
						Sign up for an account
					</h1>

					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2" htmlFor="email">
								Email
							</label>
							<input
								className="peer block w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
								id="email"
								type="email"
								name="email"
								placeholder="Enter your email address"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2" htmlFor="password">
								Password
							</label>
							<input
								className="peer block w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
								id="password"
								type={showPassword ? 'text' : 'password'}
								name="password"
								placeholder="Enter password"
								value={password}
								onChange={e => setPassword(e.target.value)}
								required
								minLength={6}
							/>
							<div className="mt-4 flex items-center">
								<input
									id="show-password"
									type="checkbox"
									onChange={() => setShowPassword(prev => !prev)}
									className="h-4 w-4 rounded border-zinc-600 text-zinc-600 focus:ring-zinc-500"
								/>
								<label htmlFor="show-password" className="ml-2 block text-sm text-zinc-500">
									Show password
								</label>
							</div>
						</div>
					</div>

					<SignupButton />

					<div className="mt-4 text-center">
						<Link href="/login" className="text-sm text-zinc-500 dark:text-zinc-400">
							Already have an account?{' '}
							<span className="font-semibold underline">Log in</span>
						</Link>
					</div>

					<div className="relative my-8">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
						</div>
						<div className="relative flex justify-center text-sm z-10">
							<span className="bg-zinc-50 px-2 text-zinc-500 dark:bg-zinc-950">OR</span>
						</div>
					</div>

					<Button
						onClick={() => signInWithGoogle()}
						type="button"
						variant="outline"
						className="w-full mb-8 gap-4"
					>
						<svg className="size-5" viewBox="0 0 24 24">
							<path
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								fill="#4285F4"
							/>
							<path
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								fill="#34A853"
							/>
							<path
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								fill="#FBBC05"
							/>
							<path
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								fill="#EA4335"
							/>
						</svg>
						Continue with Google
					</Button>

					<div className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-16">
						<Link href="/terms" className="underline hover:text-zinc-300">Terms of Use</Link>{' '}
						and{' '}
						<Link href="/privacy" className="underline hover:text-zinc-300">Privacy Policy</Link>
					</div>
				</div>
			</form>
			<Toaster />
		</>
	);
}

function SignupButton() {
	const { pending } = useFormStatus();

	return (
		<button
			className="my-4 flex h-10 w-full flex-row items-center justify-center rounded-md bg-zinc-900 p-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
			aria-disabled={pending}
		>
			{pending ? <Loader2 className="size-4 animate-spin" /> : 'Create account'}
		</button>
	);
}
