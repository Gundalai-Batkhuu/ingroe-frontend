'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userArtifactsStore } from '@/stores/userArtifactsStore';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Artefact } from '@/lib/types';
import { UpdateDocumentInfo } from '@/features/assistant-creation/components/update-worker-info';
import { ArtifactEditMode } from '@/features/assistant-creation/components/edit-worker-mode';
import { LinkDocumentUploader } from '@/features/assistant-creation/components/link-document-uploader';
import { FileDocumentUploader } from '@/features/assistant-creation/components/file-document-uploader';
import { Info, X } from 'lucide-react';

interface EditArtifactDialogProps {
	documentId: string;
	userId: string;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EditDocumentDialog({
	documentId,
	userId,
	isOpen,
	onOpenChange
}: EditArtifactDialogProps) {
	const router = useRouter();
	const { artifacts, setSelectedArtifactId } =
			userArtifactsStore();
	const [editedArtifact, setEditedArtifact] = useState<Artefact | null>(null);
	const [showSideCard, setShowSideCard] = useState(false);
	const [activeField, setActiveField] = useState<string | null>(null);
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (artifacts) {
			const artifact = artifacts.artefact_tree.find(
				a => a.document_id === documentId
			);
			if (artifact) {
				setEditedArtifact(artifact);
				setSelectedArtifactId(artifact.document_id);
			} else {
				console.error('Artifact not found');
				router.push('/');
			}
		}
	}, [artifacts, documentId, setSelectedArtifactId, router]);


	const handleCancel = () => {
		if (artifacts) {
			const originalArtifact = artifacts.artefact_tree.find(
				a => a.document_id === documentId
			);
			setEditedArtifact(originalArtifact || null);
		}
		setShowSideCard(false);
		setActiveField(null);
    setErrors({});
		onOpenChange(false);
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};
		
		if (!editedArtifact?.document_name?.trim()) {
			newErrors.document_name = "Title is required";
		}
		if (!editedArtifact?.description?.trim()) {
			newErrors.description = "Description is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSave = () => {
		if (!editedArtifact) return;
		
		if (!validateForm()) {
			return;
		}

		UpdateDocumentInfo({ updatedArtifact: editedArtifact, userId: userId });
		setShowSideCard(false);
		setActiveField(null);
		onOpenChange(false);
	};


	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		if (!editedArtifact) return;
		const { name, value } = e.target;
		setEditedArtifact(prev => (prev ? { ...prev, [name]: value } : null));
	};

	const handleAddItem = (field: string) => {
		setShowSideCard(true);
		setActiveField(field);
	};

	const handleCloseSideCard = () => {
		setShowSideCard(false);
		setActiveField(null);
	};

	if (!editedArtifact) {
		return null;
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<div className="flex items-center justify-between">
						<div>
							<DialogTitle className="mb-2">Update details</DialogTitle>
							<DialogDescription className="flex items-center gap-2">
                <Info className="size-4"/>
								<div>Update the title, description & instruction to the worker.</div>
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<div className="flex">
					<div className="w-full">
							<ArtifactEditMode
								editedArtifact={editedArtifact}
								handleInputChange={handleInputChange}
								handleAddItem={handleAddItem}
								errors={errors}
							/>
					</div>

					{showSideCard && (
						<Card className="ml-4 w-full max-w-md">
							<CardHeader className="mb-2 flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle>
									Add New {activeField?.replace('_', ' ')}
								</CardTitle>
								<Button
									size="icon"
									variant="ghost"
									onClick={handleCloseSideCard}
								>
									<X className="size-4" />
								</Button>
							</CardHeader>
							<CardContent>
								{activeField === 'web_links' ? (
									<LinkDocumentUploader
										userId={userId}
										documentId={documentId}
									/>
								) : activeField === 'files' ? (
									<FileDocumentUploader
										userId={userId}
										documentId={documentId}
									/>
								) : (
									// Add your form fields here based on the activeField
									<div>Form fields for {activeField}</div>
								)}
							</CardContent>
							{activeField !== 'files' && activeField !== 'web_links' && (
								<CardFooter className="flex justify-end space-x-2">
									<Button
										variant="outline"
										onClick={handleCloseSideCard}
									>
										Cancel
									</Button>
									<Button
										onClick={() => {
											/* Handle save logic */
										}}
									>
										Add
									</Button>
								</CardFooter>
							)}
						</Card>
					)}
				</div>

				<DialogFooter>
						<>
							<Button variant="outline" onClick={handleCancel}>
								Cancel
							</Button>
							<Button onClick={handleSave}>Save</Button>
						</>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
