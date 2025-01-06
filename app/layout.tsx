import { Analytics } from '@vercel/analytics/react';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import '@/public/globals.css';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import React from 'react';
import { Manrope } from 'next/font/google';

const manrope = Manrope({
	subsets: ['latin'],
	variable: '--font-manrope'
});

export const metadata = {
	title: 'Ingroe',
	description: 'You gateway to organised knowledge'
};

export const viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: 'white' },
		{ media: '(prefers-color-scheme: dark)', color: 'black' }
	]
};

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={`${manrope.variable}`}
			suppressHydrationWarning
		>
			<body>
				<Providers
					attribute="class"
					defaultTheme="light"
					enableSystem
					disableTransitionOnChange
				>
					<div className="flex h-screen w-screen bg-muted/40">
						{children}
						<Analytics />
					</div>
					<TailwindIndicator />
				</Providers>
				<Toaster />
			</body>
		</html>
	);
}
