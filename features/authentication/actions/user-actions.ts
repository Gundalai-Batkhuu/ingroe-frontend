'use server';

import { signIn, signOut } from '@/features/authentication/auth';
import { ResultCode, getStringFromBuffer } from '@/lib/utils';
import { userService } from '@/services/user-service';
import { User } from '@/lib/types';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { kv } from '@vercel/kv';

export async function getUser(email: string) {
	const user = await kv.hgetall<User>(`user:${email}`);
	return user;
}

interface Result {
	type: string;
	resultCode: ResultCode;
}

export async function authenticate(
	_prevState: Result | undefined,
	formData: FormData
): Promise<Result | undefined> {
	try {
		const email = formData.get('email');
		const password = formData.get('password');

		const parsedCredentials = z
			.object({
				email: z.string().email(),
				password: z.string().min(6)
			})
			.safeParse({
				email,
				password
			});

		if (parsedCredentials.success) {
			await signIn('credentials', {
				email,
				password,
				redirect: false
			});

			return {
				type: 'success',
				resultCode: ResultCode.UserLoggedIn
			};
		} else {
			return {
				type: 'error',
				resultCode: ResultCode.InvalidCredentials
			};
		}
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CredentialsSignin':
					return {
						type: 'error',
						resultCode: ResultCode.InvalidCredentials
					};
				default:
					return {
						type: 'error',
						resultCode: ResultCode.UnknownError
					};
			}
		}
	}
}

export async function createUser(
	email: string,
	hashedPassword: string,
	salt: string,
	isGoogleUser: boolean = false,
	googleUserId: string | null = null
) {
	const existingUser = await getUser(email);

	if (existingUser) {
		return {
			type: 'error',
			resultCode: ResultCode.UserAlreadyExists
		};
	}

	const user = isGoogleUser
		? {
				id: googleUserId!,
				email,
				password: hashedPassword,
				salt,
				isGoogleUser: true
			}
		: {
				id: crypto.randomUUID(),
				email,
				password: hashedPassword,
				salt,
				isGoogleUser: false
			};

	try {
		// Create user in Redis
		try {
			await kv.hmset(`user:${email}`, user);
		} catch (redisError) {
			console.error('Failed to create user in Redis:', redisError);
			return {
				type: 'error',
				resultCode: ResultCode.DatabaseError
			};
		}

		// Create user in the backend database
		try {
			await userService.createUser(user.id, email);
		} catch (dbError) {
			console.error(
				'Failed to create user in backend database:',
				dbError
			);
			// Clean up Redis since backend creation failed
			try {
				await kv.del(`user:${email}`);
			} catch (cleanupError) {
				console.error(
					'Failed to clean up Redis after backend error:',
					cleanupError
				);
			}
			return {
				type: 'error',
				resultCode: ResultCode.DatabaseError
			};
		}

		return {
			type: 'success',
			resultCode: ResultCode.UserCreated
		};
	} catch (error) {
		console.error('Unexpected error during user creation:', error);
		// Attempt to clean up Redis in case of unexpected errors
		try {
			await kv.del(`user:${email}`);
		} catch (cleanupError) {
			console.error(
				'Failed to clean up Redis after unexpected error:',
				cleanupError
			);
		}
		return {
			type: 'error',
			resultCode: ResultCode.UnknownError
		};
	}
}

interface Result {
	type: string;
	resultCode: ResultCode;
}

export async function signup(
	_prevState: Result | undefined,
	formData: FormData
): Promise<Result | undefined> {
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;

	const parsedCredentials = z
		.object({
			email: z.string().email(),
			password: z.string().min(6)
		})
		.safeParse({
			email,
			password
		});

	if (parsedCredentials.success) {
		const salt = crypto.randomUUID();

		const encoder = new TextEncoder();
		const saltedPassword = encoder.encode(password + salt);
		const hashedPasswordBuffer = await crypto.subtle.digest(
			'SHA-256',
			saltedPassword
		);
		const hashedPassword = getStringFromBuffer(hashedPasswordBuffer);

		try {
			const result = await createUser(
				email,
				hashedPassword,
				salt,
				false,
				null
			);

			if (result.resultCode === ResultCode.UserCreated) {
				await signIn('credentials', {
					email,
					password,
					redirect: false
				});
			}

			return result;
		} catch (error) {
			if (error instanceof AuthError) {
				switch (error.type) {
					case 'CredentialsSignin':
						return {
							type: 'error',
							resultCode: ResultCode.InvalidCredentials
						};
					default:
						return {
							type: 'error',
							resultCode: ResultCode.UnknownError
						};
				}
			} else {
				return {
					type: 'error',
					resultCode: ResultCode.UnknownError
				};
			}
		}
	} else {
		return {
			type: 'error',
			resultCode: ResultCode.InvalidCredentials
		};
	}
}

export async function removeUser(email: String): Promise<Result> {
	try {
		// Remove user from Redis
		await kv.del(`user:${email}`);

		// Remove user from backend database
		// Note: We're assuming userService has a method to delete a user. If it doesn't, you'll need to add one.
		// await userService.deleteUser(email)

		await signOut({ redirect: false });

		return {
			type: 'success',
			resultCode: ResultCode.UserRemoved
		};
	} catch (error) {
		console.error('Failed to remove user:', error);
		return {
			type: 'error',
			resultCode: ResultCode.UnknownError
		};
	}
}

export async function signout(): Promise<Result> {
	try {
		await signOut({ redirect: false });
		return {
			type: 'success',
			resultCode: ResultCode.UserLoggedOut
		};
	} catch (error) {
		return {
			type: 'error',
			resultCode: ResultCode.UnknownError
		};
	}
}

export async function signInWithGoogle() {
	await signIn('google', { redirectTo: '/manage-assistants' });
}

export async function handleGoogleSignInCallback(user: any, account: any) {
	if (account?.provider === 'google') {
		const existingUser = await getUser(user.email!);

		if (!existingUser) {
			const userId = account.providerAccountId;
			// Create a new user for first-time Google sign-ins
			const result = await createUser(
				user.email!,
				crypto.randomUUID(), // Random password for Google users
				crypto.randomUUID(), // Random salt
				true,
				userId
			);

			if (result.type === 'success') {
				user.id = userId; // Use Google's sub as the ID
				return true;
			}
			return false;
		}
		// If user exists, set their ID
		user.id = existingUser.id;
	}
	return true;
}
