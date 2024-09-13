import React from 'react'
import { removeUser } from '@/features/authentication/actions/user-actions'

interface RemoveUserFormProps {
  email: string;
}

export function RemoveUserForm({ email }: RemoveUserFormProps) {
  return (
    <form
      action={async () => {
        'use server'
        await removeUser(email)
      }}
    >
      <button>
        Delete Account
      </button>
    </form>
  )
}