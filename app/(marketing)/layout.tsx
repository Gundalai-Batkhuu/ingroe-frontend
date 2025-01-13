'use client';

import MarketingHeaderContent from '@/features/marketing/components/marketing-header';
import { usePathname } from 'next/navigation';
import MarketingFooterContent from '@/features/marketing/components/marketing-footer';
export default function MarketingLayout({
	children
}: {
	children: React.ReactNode;
}) {

	const pathname = usePathname();

	if (!pathname) {
		return null; // Add a safety check for SSR
	}
	return (
		<>
			<div className="h-full flex-1 flex-col overflow-x-hidden">
				<header
			id="header"
			className={`group sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-white/50 backdrop-blur-2xl dark:bg-gray-950/50 ${
				pathname.startsWith('/chat')
					? 'ml-[25%] w-[75%] lg:ml-[20%] lg:w-[80%] xl:ml-[15%] xl:w-[85%]'
					: ''
			}`}
				>
					<MarketingHeaderContent />
				</header>
				<main>
					{children}
				</main>
				
				<footer className="bg-white dark:bg-gray-950 variant-outlined !bg-transparent">
					<MarketingFooterContent />
				</footer>
			</div>
		</>
	);
}
