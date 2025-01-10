'use client';

import React, { useState } from 'react';
import { useResourceItemsStore } from '@/features/assistant-creation/stores/useResourceItemsStore';
import { FileWithPath } from 'react-dropzone';
import { UploadedFilesCard } from './uploaded-files-card';
import { FileUploadCard } from './file-upload-card';
import { NewAssistantCard } from './new-assistant-dialog';

interface AssistantCreatorProps {
	userId: string;
}

export default function AssistantCreator({ userId }: AssistantCreatorProps) {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [instructions, setInstructions] = useState('');
	const [activeTab, setActiveTab] = useState('file');

	const { addResourceItem } = useResourceItemsStore();

	const handleFileUpload = (files: FileWithPath[]) => {
		files.forEach(file => {
			addResourceItem('file', file);
		});
	};

	const isAssistantCreated = title && description;

	return (
		<div className="h-full flex flex-col space-y-4 rounded-lg bg-background p-4">
			
			{/* Header Section */}
			<div className="h-14 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Assistant Hub</h1>
					<p className="text-sm text-muted-foreground">
						Manage assistant {'>'} Create new assistant
					</p>
				</div>
			</div>

			{/* Content Section */}
			<div className="flex-1 rounded-lg border p-4">
				
			{isAssistantCreated ? (
				<div className="flex h-full flex-1 gap-6">
					<FileUploadCard
						userId={userId}
						activeTab={activeTab}
						setActiveTab={setActiveTab}
						onFileUpload={handleFileUpload}
					/>
					<UploadedFilesCard 
						userId={userId}
						title={title}
						description={description}
					/>
				</div>
			) : (
				<NewAssistantCard
					setDescription={setDescription}
					setTitle={setTitle}
					setInstructions={setInstructions}
				/>
			)}
		</div>
		</div>
	);
}
