import { LoginForm } from '@/features/authentication/forms/login-form';
import { Session } from '@/lib/types';
import { auth } from '@/features/authentication/auth';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
	const session = (await auth()) as Session;

	if (session) {
		redirect('/');
	}

	return (
		<main className="my-20 w-full">
			<LoginForm />
		</main>
	);
}
