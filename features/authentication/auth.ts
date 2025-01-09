import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { getStringFromBuffer } from '@/lib/utils';
import { createUser, getUser, handleGoogleSignInCallback } from '@/features/authentication/actions/user-actions';
import Google from 'next-auth/providers/google';

export const { handlers, auth, signIn, signOut } = NextAuth({
	...authConfig,
	providers: [
		Credentials({
			async authorize(credentials) {
				const parsedCredentials = z
					.object({
						email: z.string().email(),
						password: z.string().min(6)
					})
					.safeParse(credentials);

				if (parsedCredentials.success) {
					const { email, password } = parsedCredentials.data;
					const user = await getUser(email);

					if (!user) return null;

					const encoder = new TextEncoder();
					const saltedPassword = encoder.encode(password + user.salt);
					const hashedPasswordBuffer = await crypto.subtle.digest(
						'SHA-256',
						saltedPassword
					);
					const hashedPassword =
						getStringFromBuffer(hashedPasswordBuffer);

					if (hashedPassword === user.password) {
						return user;
					} else {
						return null;
					}
				}

				return null;
			}
		}),
		Google({
			authorization: {
				params: {
					prompt: 'consent',
					access_type: 'offline',
					response_type: 'code'
				}
			}
		}),
	],
	callbacks: {
		async signIn({ user, account }) {
			return handleGoogleSignInCallback(user, account);
		},
		async jwt({ token, trigger, session, user, account }) {
			if (account?.provider === 'google') {
				token.id = account.providerAccountId;
			} else if (user) {
				token.id = user.id;
			}
			token.email = user?.email || token.email;

			if (trigger === 'update' && session) {
				token = { ...token, ...session };
			}

			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
				session.user.email = token.email as string;
			}
			return session;
		}
	}
});
