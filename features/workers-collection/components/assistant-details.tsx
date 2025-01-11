'use client';

import { useEffect, useState} from 'react';
import { userArtifactsStore } from '@/stores/userArtifactsStore';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { Calendar, Edit, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { EditDocumentDialog } from './edit-document-dialog';

interface AssistantDetailsProps {
	searchParams: { q: string; offset: string };
	userId: string;
	assistantId: string;
}

export default function AssistantDetails({
	searchParams,
	userId,
	assistantId
}: AssistantDetailsProps) {
	const router = useRouter();
	const { artifacts, isLoading, error, fetchUserArtifacts } = userArtifactsStore();
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

	useEffect(() => {
		if (userId) {
			fetchUserArtifacts(userId);
		}
	}, [userId]);

	const assistantDetails = artifacts?.artefact_tree.find(artifact => artifact.document_id === assistantId);


	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-muted-foreground">Loading artifacts...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-destructive">Error loading artifacts: {error}</div>
			</div>
		);
	}

	if (!artifacts) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-muted-foreground">No artifacts found</div>
			</div>
		);
	}


	return (
		<div className="h-full flex flex-col space-y-4 rounded-lg bg-background p-4">
			{/* Header Section - Updated to match workers-page-content */}
			<div className="h-14 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Assistant Hub</h1>
					<p className="text-sm text-muted-foreground">
						Manage assistants {'>'} Assistant Details
					</p>
				</div>

				<div className="flex items-center gap-2">
					<Button variant="outline" size="lg" onClick={() => setIsEditDialogOpen(true)}>Edit</Button>
					<EditDocumentDialog documentId={assistantId} userId={userId} isOpen={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}/>
					<MoreVertical className="size-6 text-muted-foreground" />
				</div>
			</div>

			{/* Content Section */}
			<div className="flex-1 rounded-lg border p-4">
				<div className="flex items-center justify-between">
					<div className="text-lg font-semibold"> Details </div>
					<div className="flex items-center gap-2">
						<Button variant="outline" size="lg" onClick={() => setIsEditDialogOpen(true)}>Edit</Button>
						<EditDocumentDialog documentId={assistantId} userId={userId} isOpen={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}/>
						<MoreVertical className="size-6 text-muted-foreground" />
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-2">
						<span className="font-medium font-semibold">Title:</span>
						<span>{assistantDetails?.document_name}</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="font-medium font-semibold">Description:</span>
						<span>{assistantDetails?.description}</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="font-medium font-semibold">Instructions:</span>
						<span>{assistantDetails?.instruction}</span>
					</div>
				</div>
			
			<div className="flex items-center justify-between border-t py-4 mt-4">
				<div className="text-lg font-semibold">Files</div>
			</div>
			
			<Table>
				<TableCaption>
					Files unavailable
				</TableCaption>
				<TableHeader className="bg-muted/50">
					<TableRow>
						<TableHead className="font-semibold">
							File Names
						</TableHead>
						<TableHead className="font-semibold">
							Modified date
						</TableHead>
						<TableHead className="font-semibold">
							File type
						</TableHead>
						<TableHead className="font-semibold">
							Action
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{assistantDetails?.captured_documents?.map(
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
		</div>
	);
}
