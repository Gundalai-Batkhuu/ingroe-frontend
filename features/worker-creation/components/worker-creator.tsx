'use client';

import React, { useEffect, useState } from 'react';
import {
	Upload,
	Link,
	PenTool,
	File,
	Plus,
	X,
	Trash2,
	FileText,
	FileSpreadsheet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WorkerCreationButton } from '@/features/worker-creation/components/worker-creation-button';
import { NewWorkerDialog } from '@/features/worker-creation/components/new-worker-dialog';
import WebSearchContainer from '@/features/google-search/components/web-search-container';
import { useResourceItemsStore } from '@/features/worker-creation/stores/useResourceItemsStore';
import { FileWithPath } from 'react-dropzone';
import HandwrittenNotesEditor from '@/features/handwriting-recognition/components/handwritten-notes-content';
import { FileUploader } from '@/features/worker-creation/components/file-uploader';
import { cn } from '@/lib/utils';

interface WorkerCreatorProps {
	userId: string;
}

export default function WorkerCreator({ userId }: WorkerCreatorProps) {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [noteFileInput, setNoteFileInput] = useState<string>('');
	const [isDialogOpen, setIsDialogOpen] = useState(true);
	const [activeTab, setActiveTab] = useState('file');

	const {
		resourceItems,
		addResourceItem,
		removeResourceItem,
		clearResourceItems
	} = useResourceItemsStore();

	const handleFileUpload = (files: FileWithPath[]) => {
		files.forEach(file => {
			addResourceItem('file', file);
		});
	};

	const handleNoteFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			addResourceItem('note', file);
			setNoteFileInput('');
		}
	};

	const tabs = [
		{ id: 'file', label: 'Files' },
		{ id: 'web-links', label: 'Web Links' },
		{ id: 'electronics', label: 'Electronic Files' },
		{ id: 'note', label: 'Handwritten Notes' }
	];

	return (
		<div className="flex h-full flex-col">
			<div className="flex h-full flex-1 gap-6">
				<Card className="h-full w-3/4">
					<CardHeader>
						<CardTitle>{title || 'Worker name'}</CardTitle>
						<CardDescription>
							{description || 'Worker description'}
						</CardDescription>
					</CardHeader>
					<CardContent className="flex h-[calc(100%-5.5rem)] flex-col px-6">
						<div className="border-b">
							<nav className="flex space-x-8">
								{tabs.map(tab => (
									<button
										key={tab.id}
										onClick={() => setActiveTab(tab.id)}
										className={cn(
											'px-2 pb-1 text-sm font-medium transition-colors hover:text-primary',
											{
												'border-b-2 border-brand-green font-semibold text-brand-green hover:text-brand-green':
													activeTab === tab.id,
												'text-muted-foreground':
													activeTab !== tab.id
											}
										)}
									>
										{tab.label}
									</button>
								))}
							</nav>
						</div>

						<div className="mt-4 h-full">
							{activeTab === 'file' && (
								<FileUploader onFileUpload={handleFileUpload} />
							)}
							{activeTab === 'electronics' && <div />}
							{activeTab === 'note' && (
								<HandwrittenNotesEditor userId={userId} />
							)}
							{activeTab === 'web-links' && (
								<WebSearchContainer userId={userId} />
							)}
						</div>
					</CardContent>
				</Card>

				<Card className="flex h-full w-1/4 flex-col">
					<CardHeader>
						<CardTitle>Uploaded files</CardTitle>
					</CardHeader>
					<CardContent className="flex-1 overflow-hidden">
						<ScrollArea className="h-full">
							<ul className="space-y-2">
								{resourceItems.map(resource => (
									<li
										key={resource.id}
										className="flex items-center justify-between py-1.5"
									>
										<span className="flex items-center text-sm">
											{resource.type === 'file' && (
												<>
													{/\.(pdf)$/i.test(
														resource.displayName
													) && (
														<FileText className="mr-2 size-6 text-gray-600" />
													)}
													{/\.(xlsx|xls)$/i.test(
														resource.displayName
													) && (
														<FileSpreadsheet className="mr-2 size-6 text-gray-600" />
													)}
													{/\.(docx|md|txt)$/i.test(
														resource.displayName
													) && (
														<File className="mr-2 size-6 text-gray-600" />
													)}
													{!/\.(pdf|xlsx|xls|docx|md|txt)$/i.test(
														resource.displayName
													) && (
														<File className="mr-2 size-6 text-gray-600" />
													)}
												</>
											)}
											{resource.type === 'link' && (
												<Link className="mr-2 size-4 text-gray-600" />
											)}
											{resource.type === 'note' && (
												<PenTool className="mr-2 size-4 text-gray-600" />
											)}
											<span className="mx-2 text-gray-900">
												{resource.displayName}
											</span>
										</span>
										<Button
											size="icon"
											variant="ghost"
											onClick={() =>
												removeResourceItem(resource.id)
											}
											aria-label={`Remove ${resource.type}`}
											className="size-6 pl-2 hover:bg-transparent"
										>
											<Trash2 className="size-4 text-gray-400 transition-colors hover:text-red-500" />
										</Button>
									</li>
								))}
							</ul>
						</ScrollArea>
					</CardContent>
					<CardFooter className="flex justify-between gap-4 p-4">
						<Button
							variant="outline"
							onClick={clearResourceItems}
							disabled={resourceItems.length === 0}
							className="flex-1"
						>
							Clear All
						</Button>
						<WorkerCreationButton
							userId={userId}
							title={title || ''}
							description={description || ''}
							className="flex-1"
						/>
					</CardFooter>
				</Card>
			</div>

			<NewWorkerDialog
				setDescription={setDescription}
				setTitle={setTitle}
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
			/>
		</div>
	);
}
