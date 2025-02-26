'use client';

import { useEffect, useState } from 'react';
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
import { EditDocumentDialog } from './edit-document-dialog';
import { Artefact } from '@/lib/types';

interface FileDetails {
	file_url: string;
	file_name: string;
	created_at?: string;
	status?: string;
}

interface Artifact {
	document_id: string;
	document_name: string;
	description: string;
	instruction: string;
	files?: FileDetails[];
}

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
	const { artifacts, isLoading, error, fetchUserArtifacts } =
		userArtifactsStore();
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

	useEffect(() => {
		if (userId) {
			fetchUserArtifacts(userId);
		}
	}, [userId]);

	const assistantDetails = artifacts?.artefact_tree.find(
		(artifact: Artefact) => artifact.document_id === assistantId
	);

	if (isLoading) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="text-muted-foreground">
					Loading artifacts...
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="text-destructive">
					Error loading artifacts: {error}
				</div>
			</div>
		);
	}

	if (!artifacts) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="text-muted-foreground">No artifacts found</div>
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col space-y-4 rounded-lg bg-background p-4">
			{/* Header Section - Updated to match workers-page-content */}
			<div className="flex h-14 items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Assistant Hub</h1>
					<p className="text-sm text-muted-foreground">
						Manage assistants {'>'} Assistant Details
					</p>
				</div>

			</div>

			{/* Content Section */}
			<div className="flex-1 rounded-lg border p-4">
				<div className="flex items-center justify-between">
					<div className="text-lg font-semibold"> Details </div>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="lg"
							onClick={() => setIsEditDialogOpen(true)}
						>
							Edit
						</Button>
						<EditDocumentDialog
							documentId={assistantId}
							userId={userId}
							isOpen={isEditDialogOpen}
							onOpenChange={setIsEditDialogOpen}
						/>
						<MoreVertical className="size-6 text-muted-foreground" />
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-2">
						<span className="font-semibold">
							Title:
						</span>
						<span>{assistantDetails?.document_name}</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="font-semibold">
							Description:
						</span>
						<span>{assistantDetails?.description}</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="font-semibold">
							Instructions:
						</span>
						<span>{assistantDetails?.instruction}</span>
					</div>
				</div>

				<div className="mt-4 flex items-center justify-between border-t py-4">
					<div className="text-lg font-semibold">Files</div>
				</div>

				<Table>
					<TableHeader className="bg-muted/50">
						<TableRow>
							<TableHead className="font-semibold">File Names</TableHead>
							<TableHead className="font-semibold">File type</TableHead>
							<TableHead className="font-semibold">Status</TableHead>
							<TableHead className="font-semibold">Modified date</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{assistantDetails?.files?.map((file: any) => {
							const fileName = file.file_name.split('.').slice(0, -1).join('.');
							const fileExtension = file.file_name.split('.').pop()?.toLowerCase() || '';
							const formattedDate = file.created_at 
								? new Date(file.created_at).toLocaleDateString('en-US', {
									day: '2-digit',
									month: 'short',
									year: 'numeric'
								})
								: '14/01/2025';

							return (
								<TableRow key={file.file_url}>
									<TableCell className="font-medium">{fileName}</TableCell>
									<TableCell className="uppercase">{fileExtension}</TableCell>
									<TableCell>
										<span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
											{file.status || 'Ready'}
										</span>
									</TableCell>
									<TableCell className="flex items-center gap-2">
										<Calendar className="size-4 text-muted-foreground" />
										{formattedDate}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
