'use client';

import React, { useEffect } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeleteWorkerButton } from '@/features/assistant-creation/components/delete-worker-button';
import { WorkerChatButton } from '@/features/chat/components/chat-with-worker-button';
import { userArtifactsStore } from '@/stores/userArtifactsStore';
import { EditWorkerButton } from '@/features/assistant-creation/components/edit-worker-button';
import Image from 'next/image';

export function AvailableWorkersTable({
	searchParams,
	userId
}: {
	searchParams: { q: string; offset: string };
	userId: string;
}) {
	const router = useRouter();

	const { artifacts, error, fetchUserArtifacts } = userArtifactsStore();

	useEffect(() => {
		if (userId) {
			fetchUserArtifacts(userId);
		}
	}, [userId]);

	const search = searchParams.q || '';
	const offset = parseInt(searchParams.offset || '0', 10);

	if (error) return <div>Error: {error}</div>;

	if (!artifacts)
		return <div className="text-muted-foreground">No assistants found</div>;

	const filteredArtifacts = artifacts.artefact_tree.filter(artifact =>
		artifact.document_name.toLowerCase().includes(search.toLowerCase())
	);

	const paginatedArtifacts = filteredArtifacts.slice(offset, offset + 5);
	const totalArtifacts = filteredArtifacts.length;

	if (totalArtifacts === 0) {
		return (
			<Card className="flex h-full flex-col items-center justify-center border-none p-8">
				<Image
					src="/no_workers.png"
					alt="No assistants found"
					width={300}
					height={300}
					priority
				/>
				<CardTitle className="mt-4">No assistants available</CardTitle>
				<CardDescription className="mt-2">
					Create a new assistant to get started
				</CardDescription>
			</Card>
		);
	}

	function prevPage() {
		router.push(`/?offset=${Math.max(0, offset - 5)}`, { scroll: false });
	}

	function nextPage() {
		router.push(`/?offset=${offset + 5}`, { scroll: false });
	}

	const handleDeleteSuccess = () => {
		fetchUserArtifacts(userId);
	};

	const handleEditArtifact = (artifactId: string) => {
		router.push(`/manage-assistants/details/${artifactId}`);
	};

	return (
		<Card className="flex h-full flex-col border-0 shadow-none">
			<CardHeader>
				<CardTitle>Assistants available</CardTitle>
			</CardHeader>
			<CardContent className="flex-grow">
				<div className="grid gap-4">
					{paginatedArtifacts.map(artifact => (
						<Card
							key={artifact.document_id}
							className="hover:bg-gray-50 hover:shadow-md"
						>
							<CardContent className="flex flex-row items-center justify-between py-4">
								<div className="flex items-center space-x-4">
									<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
										<Bot className="size-6 text-brand-green" />
									</div>
									<div>
										<CardTitle className="text-lg font-semibold">
											{artifact.document_name}
										</CardTitle>
										<CardDescription>
											Created date: 15/01/2025
										</CardDescription>
									</div>
									<div className="flex items-center gap-2">
										<EditWorkerButton
											documentId={artifact.document_id}
											onEdit={handleEditArtifact}
										/>
										<DeleteWorkerButton
											document_id={artifact.document_id}
											user_id={userId}
											onSuccess={handleDeleteSuccess}
											documentName={
												artifact.document_name
											}
										/>
									</div>
								</div>
								<WorkerChatButton
									artifactId={artifact.document_id}
								/>
							</CardContent>
						</Card>
					))}
				</div>
			</CardContent>
			<CardFooter className="mt-auto">
				<form className="flex w-full items-center justify-between">
					<div className="text-xs text-muted-foreground">
						Showing{' '}
						<strong>
							{offset + 1}-{Math.min(offset + 5, totalArtifacts)}
						</strong>{' '}
						of <strong>{totalArtifacts}</strong> assistants
					</div>
					<div className="flex">
						<Button
							onClick={prevPage}
							variant="ghost"
							size="sm"
							disabled={offset === 0}
						>
							<ChevronLeft className="mr-2 h-4 w-4" />
							Prev
						</Button>
						<Button
							onClick={nextPage}
							variant="ghost"
							size="sm"
							disabled={offset + 5 >= totalArtifacts}
						>
							Next
							<ChevronRight className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</form>
			</CardFooter>
		</Card>
	);
}
