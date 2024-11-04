'use client';

import React from 'react'
import { signOut } from '@/features/authentication/auth'
import { useRouter } from 'next/navigation'

export function SignoutForm() {
    const router = useRouter()

    return (
      <form
        action={async () => {
          'use server';
          await signOut();
          router.push('/');
        }}
      >
        <button type="submit">Sign Out</button>
      </form>
    )
}