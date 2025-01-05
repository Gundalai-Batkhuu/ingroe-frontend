import React, { useState } from 'react';

interface SidebarProps {
	isSidebarOpen?: boolean;
	isMobileMenuOpen?: boolean;
}

export default function Sidebar({
	isSidebarOpen,
	isMobileMenuOpen
}: SidebarProps) {
	return (
		<aside
			className={`flex h-screen w-64 flex-col border-r bg-white transition-all duration-300 ${
				isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
			} ${isMobileMenuOpen ? 'block' : 'hidden'} lg:relative lg:block lg:translate-x-0`}
		>
			{/* Sidebar Header */}
			<div className="flex h-16 items-center bg-[hsl(var(--nav-bg))] p-2 text-xl font-bold">
				<h2 className={'text-lg'}>Chat History</h2>
			</div>
			{/* Sidebar Content */}
			<div className="h-full flex-1 overflow-y-auto bg-[hsl(var(--sidebar-bg))] p-4">
				<p className={'text-primary'}>Sidebar content</p>
			</div>
		</aside>
	);
}
