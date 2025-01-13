'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { userArtifactsStore } from '@/stores/userArtifactsStore';
import { SharedDocumentLoaned } from '@/lib/types';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface SharedArtifactsTableProps {
	userId: string;
	searchParams: { q: string; offset: string };
}

export function SharedArtifactsLoanedTable({
	userId,
	searchParams
}: SharedArtifactsTableProps) {
	const router = useRouter();
	const { artifacts, isLoading, error, fetchUserArtifacts } =
		userArtifactsStore();
	const search = searchParams.q ?? '';
	const offset = parseInt(searchParams.offset ?? '0', 10);

	useEffect(() => {
		fetchUserArtifacts(userId);
	}, [fetchUserArtifacts, userId]);

	if (error) return <div>Error: {error}</div>;
	if (!artifacts || !artifacts.shared_artifacts_loaned)
		return <div>No shared artifacts found</div>;

	const filteredDocuments = artifacts.shared_artifacts_loaned.filter(doc =>
		doc.document_alias.toLowerCase().includes(search.toLowerCase())
	);

	const paginatedDocuments = filteredDocuments.slice(offset, offset + 5);
	const totalDocuments = filteredDocuments.length;

	function prevPage() {
		router.push(`/shared-loaned?offset=${Math.max(0, offset - 5)}`, {
			scroll: false
		});
	}

	function nextPage() {
		router.push(`/shared-loaned?offset=${offset + 5}`, { scroll: false });
	}

	const handleViewDetails = (documentId: string) => {
		// Implement view details logic here
		console.log(`View details for document ${documentId}`);
	};

	return (
		<Card className="flex h-full flex-col border-none">
			<CardHeader>
				<CardTitle>Shared Artifacts (Loaned)</CardTitle>
				<CardDescription>
					View the knowledge bases shared with you by other users.
				</CardDescription>
			</CardHeader>
			<CardContent className="flex-1">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Document Alias</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>Validity</TableHead>
							<TableHead>
								<span className="sr-only">Actions</span>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedDocuments.map((doc: SharedDocumentLoaned) => (
							<TableRow key={doc.document_id}>
								<TableCell>{doc.document_alias}</TableCell>
								<TableCell>{doc.description}</TableCell>
								<TableCell>
									{doc.validity ? 'Valid' : 'Invalid'}
								</TableCell>
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												aria-haspopup="true"
												size="icon"
												variant="ghost"
											>
												<MoreHorizontal className="size-4" />
												<span className="sr-only">
													Toggle menu
												</span>
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuLabel>
												Actions
											</DropdownMenuLabel>
											<DropdownMenuItem
												onSelect={() =>
													handleViewDetails(
														doc.document_id
													)
												}
											>
												View Details
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
			<CardFooter className="mt-auto">
				<form className="flex w-full items-center justify-between">
					<div className="text-xs text-muted-foreground">
						Showing{' '}
						<strong>
							{offset + 1}-{Math.min(offset + 5, totalDocuments)}
						</strong>{' '}
						of <strong>{totalDocuments}</strong> shared artifacts
					</div>
					<div className="flex">
						<Button
							onClick={prevPage}
							variant="ghost"
							size="sm"
							disabled={offset === 0}
						>
							<ChevronLeft className="mr-2 size-4" />
							Prev
						</Button>
						<Button
							onClick={nextPage}
							variant="ghost"
							size="sm"
							disabled={offset + 5 >= totalDocuments}
						>
							Next
							<ChevronRight className="ml-2 size-4" />
						</Button>
					</div>
				</form>
			</CardFooter>
		</Card>
	);
}
