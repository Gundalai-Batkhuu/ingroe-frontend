'use client';

import * as React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SettingsMenuProps {
	isNavbarExpanded: boolean;
	toggleNavbar: () => void;
}

export function SettingsMenu({
	isNavbarExpanded,
	toggleNavbar
}: SettingsMenuProps) {
	return (
		<>
			{isNavbarExpanded ? (
				<Button
					variant="ghost"
					className="group flex w-full items-center justify-between px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
				>
					<div className="flex items-center gap-3">
						<Settings className="size-5 text-muted-foreground transition-colors group-hover:text-brand-green" />
						<span className="text-sm font-bold text-foreground dark:text-foreground">
							Settings
						</span>
					</div>
				</Button>
			) : (
				<Button
					variant="ghost"
					className="group flex items-center justify-center px-2 hover:bg-gray-100 dark:hover:bg-gray-800"
					onClick={() => toggleNavbar()}
				>
					<Settings className="size-5 text-muted-foreground transition-colors group-hover:text-brand-green" />
				</Button>
			)}
		</>
	);
}
