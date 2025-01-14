'use client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AvailableWorkersTable } from '@/features/workers-collection/components/available-workers-table';
import { SharedArtifactsOwnedTable } from '@/features/workers-collection/components/shared-artifacts-owned-table';
import { SharedArtifactsLoanedTable } from '@/features/workers-collection/components/shared-artifacts-loaned-table';
import { RawAllArtifactsResponse } from '@/features/workers-collection/components/raw-all-artifacts-response';

interface ManageAssistantsTabsProps {
	searchParams: { q: string; offset: string };
	userId: string;
}

export default function ManageAssistantsTabs({
	searchParams,
	userId
}: ManageAssistantsTabsProps) {
	return (
		<div className="h-full">
			<Tabs
				defaultValue="available"
				className="flex h-full w-full flex-col"
			>
				<TabsList className="flex justify-start space-x-8 bg-transparent">
					<TabsTrigger
						value="available"
						className="px-2 pb-1 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-brand-green data-[state=active]:text-brand-green data-[state=inactive]:text-muted-foreground"
					>
						Available
					</TabsTrigger>
					<TabsTrigger
						value="shared-to-you"
						className="px-2 pb-1 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-brand-green data-[state=active]:text-brand-green data-[state=inactive]:text-muted-foreground"
					>
						Shared to you
					</TabsTrigger>
					<TabsTrigger
						value="shared-by-you"
						className="px-2 pb-1 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-brand-green data-[state=active]:text-brand-green data-[state=inactive]:text-muted-foreground"
					>
						Shared by you
					</TabsTrigger>
					{/* <TabsTrigger
						value="raw"
						className="px-2 pb-1 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-brand-green data-[state=active]:text-brand-green data-[state=inactive]:text-muted-foreground"
					>
						Raw
					</TabsTrigger> */}
				</TabsList>

				<div className="flex-1">
					<TabsContent
						className="h-full max-h-full"
						value="available"
					>
						<AvailableWorkersTable
							searchParams={searchParams}
							userId={userId}
						/>
					</TabsContent>
					<TabsContent
						className="h-full max-h-full"
						value="shared-to-you"
					>
						<SharedArtifactsLoanedTable
							searchParams={searchParams}
							userId={userId}
						/>
					</TabsContent>
					<TabsContent
						className="h-full max-h-full"
						value="shared-by-you"
					>
						<SharedArtifactsOwnedTable
							searchParams={searchParams}
							userId={userId}
						/>
					</TabsContent>
					<TabsContent className="h-full max-h-full" value="raw">
						<RawAllArtifactsResponse userId={userId} />
					</TabsContent>
				</div>
			</Tabs>
		</div>
	);
}
