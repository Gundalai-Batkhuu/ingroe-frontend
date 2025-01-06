import { auth } from '@/features/authentication/auth';
import { redirect } from 'next/navigation';
import { Session } from '@/lib/types';

export async function checkAuth(redirectTo?: string) {
  const session = await auth() as Session;
  
  if (!session?.user) {
    redirect(redirectTo || '/login');
  }
  
  return session;
} 