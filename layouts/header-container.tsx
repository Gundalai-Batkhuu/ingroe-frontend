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
		
	);
}
