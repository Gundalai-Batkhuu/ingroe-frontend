import SignupForm from '@/features/authentication/forms/signup-form';
import {Session} from '@/lib/types'
import {auth} from '@/features/authentication/auth'
import { redirect } from 'next/navigation'

export default async function SignupPage() {
    const session = (await auth()) as Session

    if (session) {
        redirect('/')
    }

    return (
        <main className="flex flex-col p-4 my-20">
            <SignupForm/>
        </main>
    );
};
