import React from 'react';
import { removeUser } from '@/features/authentication/actions/user-actions';

interface RemoveUserFormProps {
	email?: string | null | undefined;
}

export function RemoveUserForm({ email }: RemoveUserFormProps) {
	const handleSubmit = async (formData: FormData) => {
		'use server';
		if (email) {
			await removeUser(email);
		} else {
			console.error('No email provided for user removal');
			// Handle the error appropriately, e.g., throw an error or return an error message
		}
	};

	return (
		<form action={handleSubmit}>
			<button type="submit" disabled={!email}>
				Delete Account
			</button>
		</form>
	);
}
