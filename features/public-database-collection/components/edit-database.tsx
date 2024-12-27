'use client';

import { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Trash, Plus, Edit } from 'lucide-react';

interface CapturedDocument {
	id: string;
	name: string;
}

interface Artefact {
	document_id: string;
	document_name: string;
	vanilla_links: string[];
	file_links: string[];
	files: string[];
	description: string;
	captured_documents: CapturedDocument[];
}

interface EditDatabaseProps {
	artifact: Artefact;
}

export default function EditDatabase({ artifact }: EditDatabaseProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editedArtifact, setEditedArtifact] = useState<Artefact>(artifact);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleCancel = () => {
		setIsEditing(false);
		setEditedArtifact(artifact);
	};

	const handleSave = () => {
		console.log('Saving changes:', editedArtifact);
		// Here you would typically send the updated data to your backend
		setIsEditing(false);
	};

	const handleDelete = () => {
		console.log('Delete artifact:', artifact.document_id);
		// Implement delete logic here
	};

	const handleAdd = () => {
		console.log('Add new artifact');
		// Implement add logic here
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setEditedArtifact(prev => ({ ...prev, [name]: value }));
	};

	const handleArrayChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
		field: keyof Artefact
	) => {
		const value = e.target.value
			.split('\n')
			.filter(item => item.trim() !== '');
		setEditedArtifact(prev => ({ ...prev, [field]: value }));
	};

	return (
		<Card className="w-full max-w-2xl">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<div>
					<CardTitle>Database Artifact</CardTitle>
					<CardDescription>
						View and edit artifact details.
					</CardDescription>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							aria-haspopup="true"
							size="icon"
							variant="ghost"
						>
							<MoreHorizontal className="size-4" />
							<span className="sr-only">Toggle menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{!isEditing && (
							<DropdownMenuItem onClick={handleEdit}>
								<Edit className="mr-2 h-4 w-4" />
								<span>Edit</span>
							</DropdownMenuItem>
						)}
						<DropdownMenuItem onClick={handleDelete}>
							<Trash className="mr-2 h-4 w-4" />
							<span>Delete</span>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleAdd}>
							<Plus className="mr-2 h-4 w-4" />
							<span>Add New</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</CardHeader>
			<CardContent>
				<div className="grid w-full items-center gap-4">
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="document_name">Document Name</Label>
						{isEditing ? (
							<Input
								id="document_name"
								name="document_name"
								value={editedArtifact.document_name}
								onChange={handleInputChange}
							/>
						) : (
							<div className="rounded-md bg-secondary p-2">
								{artifact.document_name}
							</div>
						)}
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="description">Description</Label>
						{isEditing ? (
							<Textarea
								id="description"
								name="description"
								value={editedArtifact.description}
								onChange={handleInputChange}
							/>
						) : (
							<div className="rounded-md bg-secondary p-2">
								{artifact.description}
							</div>
						)}
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="vanilla_links">Vanilla Links</Label>
						{isEditing ? (
							<Textarea
								id="vanilla_links"
								name="vanilla_links"
								value={editedArtifact.vanilla_links.join('\n')}
								onChange={e =>
									handleArrayChange(e, 'vanilla_links')
								}
							/>
						) : (
							<div className="rounded-md bg-secondary p-2">
								{artifact.vanilla_links.map((link, index) => (
									<div key={index}>{link}</div>
								))}
							</div>
						)}
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="file_links">File Links</Label>
						{isEditing ? (
							<Textarea
								id="file_links"
								name="file_links"
								value={editedArtifact.file_links.join('\n')}
								onChange={e =>
									handleArrayChange(e, 'file_links')
								}
							/>
						) : (
							<div className="rounded-md bg-secondary p-2">
								{artifact.file_links.map((link, index) => (
									<div key={index}>{link}</div>
								))}
							</div>
						)}
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="files">Files</Label>
						{isEditing ? (
							<Textarea
								id="files"
								name="files"
								value={editedArtifact.files.join('\n')}
								onChange={e => handleArrayChange(e, 'files')}
							/>
						) : (
							<div className="rounded-md bg-secondary p-2">
								{artifact.files.map((file, index) => (
									<div key={index}>{file}</div>
								))}
							</div>
						)}
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label>Captured Documents</Label>
						<div className="rounded-md bg-secondary p-2">
							{artifact.captured_documents.map(doc => (
								<div key={doc.id}>{doc.name}</div>
							))}
						</div>
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex justify-end space-x-2">
				{isEditing ? (
					<>
						<Button variant="outline" onClick={handleCancel}>
							Cancel
						</Button>
						<Button onClick={handleSave}>Save Changes</Button>
					</>
				) : (
					<Button onClick={handleEdit}>Edit</Button>
				)}
			</CardFooter>
		</Card>
	);
}
