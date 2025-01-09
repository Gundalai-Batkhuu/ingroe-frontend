'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Logo from '@/layouts/logo';

export default function MarketingHeaderContent() {
	return (
		<>	
			<div className="flex items-center gap-4">
				<Logo />
				<span className="text-2xl font-bold text-brand-green">Ingroe</span>
			</div>
			<div className="flex items-center gap-6">
				<Link href="/documentation">
					<Button variant="ghost">Documentation</Button>
				</Link>

				<Button variant="ghost">Company</Button>
				<Link href="/login">
					<Button>Login</Button>
				</Link>
				<Link href="/signup">
					<Button>Sign Up Now</Button>
				</Link>
			</div>
		</>
	);
}
