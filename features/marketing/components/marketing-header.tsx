'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Logo from '@/layouts/logo';

export default function MarketingHeaderContent() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<nav className="m-auto h-full w-full max-w-6xl px-6">
			<div className="flex h-full items-center justify-between py-2 sm:py-4">
				<div className="flex items-center gap-2">
					<Logo />
					<span className="text-2xl font-bold text-brand-green">
						Ingroe
					</span>
				</div>

				<button
					onClick={() => setIsMenuOpen(!isMenuOpen)}
					className="lg:hidden"
					aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
				>
					<svg
						className="text-title m-auto size-6 transition-[transform,opacity] duration-300 group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M3.75 9h16.5m-16.5 6.75h16.5"
						></path>
					</svg>
					<svg
						className="text-title absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 transition-[transform,opacity] duration-300 group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 18 18 6M6 6l12 12"
						></path>
					</svg>
				</button>

				<div className={`
					fixed inset-x-0 top-[4rem] z-50 bg-background p-6
					lg:static lg:z-auto lg:flex lg:w-auto lg:items-center lg:p-0
					${isMenuOpen ? 'block' : 'hidden lg:flex'}
				`}>
					<ul className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-x-6 lg:space-y-0">
						{['Product', 'Docs', 'Pricing'].map((item) => (
							<li key={item}>
								<Link
									href="#"
									className="text-muted-foreground hover:text-foreground block transition-colors"
								>
									{item}
								</Link>
							</li>
						))}
					</ul>

					<div className="mt-6 flex flex-col gap-4 border-t pt-6 lg:ml-8 lg:mt-0 lg:flex-row lg:items-center lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
						<Link href="/login" className="text-muted-foreground hover:text-foreground">
							Login
						</Link>
						<Link href="/signup">
							<Button>Signup</Button>
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
}
