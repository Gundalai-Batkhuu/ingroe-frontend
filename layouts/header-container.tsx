'use client';

import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export default function HeaderContainer({ slot }: { slot: ReactNode }) {
	const pathname = usePathname();

	return (
		<header
			className={`sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-6 ${
				pathname.startsWith('/chat')
					? 'ml-[25%] w-[75%] lg:ml-[20%] lg:w-[80%] xl:ml-[15%] xl:w-[85%]'
					: ''
			}`}
		>
			{slot}
		</header>
	);
}
