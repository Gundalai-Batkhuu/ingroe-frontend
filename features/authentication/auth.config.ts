import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
	secret: process.env.AUTH_SECRET,
	pages: {
		signIn: '/login',
		newUser: '/signup'
	},
	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user;
			const isAuthPage = nextUrl.pathname.startsWith('/login') || 
								nextUrl.pathname.startsWith('/signup');
			const isPublicPage = ['/'].includes(nextUrl.pathname);
			
			// Allow public pages
			if (isPublicPage) return true;
			
			// Redirect logged-in users away from auth pages
			if (isLoggedIn && isAuthPage) {
				return Response.redirect(new URL('/admin-dashboard', nextUrl));
			}

			// Protect private pages
			if (!isLoggedIn && !isAuthPage) {
				return Response.redirect(new URL('/login', nextUrl));
			}

			return true;
		},
		async jwt({ token, user }) {
			if (user) {
				token = { ...token, id: user.id };
			}

			return token;
		},
		async session({ session, token }) {
			if (token) {
				const { id } = token as { id: string };
				const { user } = session;

				session = { ...session, user: { ...user, id } };
			}

			return session;
		}
	},
	providers: []
} satisfies NextAuthConfig;
