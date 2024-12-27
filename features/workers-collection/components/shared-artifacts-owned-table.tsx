'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { userArtifactsStore } from '@/stores/userArtifactsStore';
import { SharedDocumentOwned } from '@/lib/types';
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

export function SharedArtifactsOwnedTable({
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

	if (isLoading) return <div>Loading shared artifacts...</div>;
	if (error) return <div>Error: {error}</div>;
	if (!artifacts || !artifacts.shared_documents_owned)
		return <div>No shared artifacts found</div>;

	const filteredDocuments = artifacts.shared_documents_owned.filter(doc =>
		artifacts.artefact_tree
			.find(art => art.document_id === doc.document_id)
			?.document_name.toLowerCase()
			.includes(search.toLowerCase())
	);

	const paginatedDocuments = filteredDocuments.slice(offset, offset + 5);
	const totalDocuments = filteredDocuments.length;

	function prevPage() {
		router.push(`/shared?offset=${Math.max(0, offset - 5)}`, {
			scroll: false
		});
	}

	function nextPage() {
		router.push(`/shared?offset=${offset + 5}`, { scroll: false });
	}

	const handleRevokeAccess = (documentId: string) => {
		// Implement revoke access logic here
		console.log(`Revoke access for document ${documentId}`);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Shared Artifacts</CardTitle>
				<CardDescription>
					Manage your shared knowledge bases and their access details.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Document Name</TableHead>
							<TableHead>Shared At</TableHead>
							<TableHead>Public Access</TableHead>
							<TableHead>Access Open</TableHead>
							<TableHead>
								<span className="sr-only">Actions</span>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedDocuments.map((doc: SharedDocumentOwned) => {
							const artifact = artifacts.artefact_tree.find(
								art => art.document_id === doc.document_id
							);
							return (
								<TableRow key={doc.document_id}>
									<TableCell>
										{artifact?.document_name || 'Unknown'}
									</TableCell>
									<TableCell>
										{new Date(
											doc.shared_at
										).toLocaleString()}
									</TableCell>
									<TableCell>
										{doc.public_access ? 'Yes' : 'No'}
									</TableCell>
									<TableCell>
										{doc.access_open ? 'Yes' : 'No'}
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
														handleRevokeAccess(
															doc.document_id
														)
													}
												>
													Revoke Access
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</CardContent>
			<CardFooter>
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
