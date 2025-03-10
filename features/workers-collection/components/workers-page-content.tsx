'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import ManageAssistantsTabs from './manage-assistants-tabs';

interface WorkersPageContentProps {
	searchParams: { q: string; offset: string };
	userId: string;
}

export default function WorkersPageContent({
	searchParams,
	userId
}: WorkersPageContentProps) {
	const router = useRouter();
	return (
		<div className="flex h-full flex-col space-y-4 rounded-lg bg-background p-4">
			{/* Header Section */}
			<div className="flex h-14 items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Assistant Hub</h1>
					<p className="text-sm text-muted-foreground">
						Manage assistants
					</p>
				</div>

				<div className="flex items-center gap-3">
					<Select defaultValue="all">
						<SelectTrigger className="w-36">
							<SelectValue placeholder="Filter" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All</SelectItem>
							{/* Add more filter options */}
						</SelectContent>
					</Select>

					<Button variant="outline" className="gap-2">
						<Calendar className="h-4 w-4" />
						15/01/2025
					</Button>

					<Button
						className="gap-2"
						onClick={() => router.push('/create-assistant')}
					>
						<Plus className="h-4 w-4" />
						Add New
					</Button>
				</div>
			</div>

			{/* Content Section */}
			<div className="flex-1 rounded-lg border p-4">
				<ManageAssistantsTabs
					searchParams={searchParams}
					userId={userId}
				/>
			</div>
		</div>
	);
}
