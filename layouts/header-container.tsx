'use client';

import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface HeaderContainerProps {
	slot: ReactNode;
}

export default function HeaderContainer({ slot }: HeaderContainerProps) {
	const pathname = usePathname();

	if (!pathname) {
		return null; // Add a safety check for SSR
	}

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
