import { auth } from '@/features/authentication/auth';
import { redirect } from 'next/navigation';
import { Session } from '@/lib/types';

export async function checkAuth(redirectTo?: string) {
	const session = (await auth()) as Session;

	if (!session?.user) {
		console.log('Redirecting to login because no user session found');
		redirect(redirectTo || '/login');
	}

	if (!session.user.id) {
		console.log('Warning: User ID is undefined in session');
	}

	return session;
}
