'use server'

import { signOut } from '@/auth'
import { removeUser } from '@/app/signup/actions'

export async function handleSignOut() {
  await signOut()
}

export async function handleRemoveUser(formData: FormData) {
  const email = formData.get('email') as string
  await removeUser(email)
}