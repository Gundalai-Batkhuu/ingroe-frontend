'use client';

import React, { useState, useEffect } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import {
	ChevronLeft,
	ChevronRight,
	ChevronDown,
	ChevronUp,
	Calendar,
	Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeleteWorkerButton } from '@/features/assistant-creation/components/delete-worker-button';
import { WorkerChatButton } from '@/features/chat/components/chat-with-worker-button';
import { userArtifactsStore } from '@/stores/userArtifactsStore';
import { EditWorkerButton } from '@/features/assistant-creation/components/edit-worker-button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import Image from 'next/image';

interface TableRowData {
	captured_document_id: string;
	captured_files?: Array<{
		file_url: string;
		file_name: string;
	}>;
	query_ready: boolean;
}

export function AvailableWorkersTable({
	searchParams,
	userId
}: {
	searchParams: { q: string; offset: string };
	userId: string;
}) {
	const router = useRouter();

	const { artifacts, isLoading, error, fetchUserArtifacts } =
		userArtifactsStore();

	useEffect(() => {
		if (userId) {
			fetchUserArtifacts(userId);
		}
	}, [userId]);
		
	const search = searchParams.q ?? '';
	const offset = parseInt(searchParams.offset ?? '0', 10);

	const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(
		{}
	);

	const toggleCard = (documentId: string) => {
		setExpandedCards(prev => ({
			...prev,
			[documentId]: !prev[documentId]
		}));
	};

	const handleCardClick = (documentId: string) => {
		router.push(`/manage-assistants/details/${documentId}`);
	};

	if (error) return <div>Error: {error}</div>;
	if (!artifacts) return <div>No artifacts found</div>;

	const filteredArtifacts = artifacts.artefact_tree.filter(artifact =>
		artifact.document_name.toLowerCase().includes(search.toLowerCase())
	);

	const paginatedArtifacts = filteredArtifacts.slice(offset, offset + 5);
	const totalArtifacts = filteredArtifacts.length;

	if (totalArtifacts === 0) {
		return (
			<Card className="flex h-full flex-col items-center justify-center p-8 border-none">
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
		router.push(`/manage-assistants/${artifactId}`);
	};

	return (
		<Card className="flex h-full flex-col border-none">
			<CardHeader>
				<CardTitle>Assistants available</CardTitle>
			</CardHeader>
			<CardContent className="flex-grow">
				<div className="grid gap-4">
					{paginatedArtifacts.map(artifact => (
						<Card key={artifact.document_id} onClick={() => handleCardClick(artifact.document_id)}> 
							<CardHeader
								className="flex cursor-pointer flex-row items-center justify-between space-y-0 pb-2"
								onClick={() => toggleCard(artifact.document_id)}
							>
								<div className="flex items-center space-x-4">
									<Button
										variant="ghost"
										size="sm"
										onClick={e => {
											e.stopPropagation();
											toggleCard(artifact.document_id);
										}}
									>
										{expandedCards[artifact.document_id] ? (
											<ChevronUp className="h-4 w-4" />
										) : (
											<ChevronDown className="h-4 w-4" />
										)}
									</Button>
									<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
										<Bot className="size-6 text-brand-green" />
									</div>
									<div>
										<CardTitle className="text-lg font-semibold">
											{artifact.document_name}
										</CardTitle>
										<CardDescription>
											Created date: 01 Nov 2024
										</CardDescription>
									</div>
									{expandedCards[artifact.document_id] && (
										<div className="flex items-center gap-2">
											<EditWorkerButton
												documentId={
													artifact.document_id
												}
												onEdit={handleEditArtifact}
											/>
											<DeleteWorkerButton
												document_id={
													artifact.document_id
												}
												user_id={userId}
												onSuccess={handleDeleteSuccess}
											/>
										</div>
									)}
								</div>
								<WorkerChatButton
									artifactId={artifact.document_id}
								/>
							</CardHeader>
							<CardContent>
								{artifact.description && (
									<p className="mt-4 text-sm text-muted-foreground">
										{artifact.description}
									</p>
								)}

								{expandedCards[artifact.document_id] && (
									<div className="mt-4">
										<Table>
											<TableHeader className="bg-muted/50">
												<TableRow>
													<TableHead className="font-semibold">
														Name
													</TableHead>
													<TableHead className="font-semibold">
														File type
													</TableHead>
													<TableHead className="font-semibold">
														Status
													</TableHead>
													<TableHead className="font-semibold">
														Modified date
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{artifact.captured_documents?.map(
													doc => (
														<TableRow
															key={
																doc.captured_document_id
															}
														>
															<TableCell>
																{doc.captured_files?.map(
																	file => (
																		<div
																			key={
																				file.file_url
																			}
																			className="text-sm"
																		>
																			{file.file_name
																				.split(
																					'.'
																				)
																				.slice(
																					0,
																					-1
																				)
																				.join(
																					'.'
																				)}
																		</div>
																	)
																)}
															</TableCell>
															<TableCell>
																{doc.captured_files?.map(
																	file => {
																		const extension =
																			file.file_name
																				.split(
																					'.'
																				)
																				.pop()
																				?.toLowerCase() ||
																			'';
																		return (
																			<div
																				key={
																					file.file_url
																				}
																				className="text-sm"
																			>
																				{
																					extension
																				}
																			</div>
																		);
																	}
																)}
															</TableCell>
															<TableCell>
																{doc.query_ready
																	? 'Ready'
																	: 'Processing'}
															</TableCell>
															<TableCell className="flex items-center gap-2">
																<Calendar className="h-4 w-4" />
																01 Nov 2024
															</TableCell>
														</TableRow>
													)
												)}
											</TableBody>
										</Table>
									</div>
								)}
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
