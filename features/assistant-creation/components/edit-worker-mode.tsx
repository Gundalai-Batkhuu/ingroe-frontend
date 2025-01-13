'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Artefact } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ArtifactEditModeProps {
	editedArtifact: Artefact;
	handleInputChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	handleAddItem: (field: string) => void;
	errors?: Record<string, string>;
}

export function ArtifactEditMode({
	editedArtifact,
	handleInputChange,
	handleAddItem,
	errors = {}
}: ArtifactEditModeProps) {
	const isFileLink = (link: string): boolean => {
		const fileExtensions = [
			'.pdf',
			'.doc',
			'.docx',
			'.xls',
			'.xlsx',
			'.ppt',
			'.pptx',
			'.txt',
			'.csv',
			'.zip',
			'.rar'
		];
		return (
			fileExtensions.some(ext => link.toLowerCase().endsWith(ext)) ||
			link.includes('/download/') ||
			link.includes('/file/')
		);
	};

	return (
		<div className="grid w-full items-center gap-4">
			<ArtifactEditField
				label="Title"
				name="document_name"
				value={editedArtifact.document_name}
				onChange={handleInputChange}
				error={errors.document_name}
			/>
			<ArtifactEditField
				label="Description"
				name="description"
				value={editedArtifact.description}
				onChange={handleInputChange}
				error={errors.description}
				isTextarea
			/>
			<ArtifactEditField
				label="Instruction"
				name="instruction"
				value={editedArtifact.instruction}
				onChange={handleInputChange}
				isTextarea
			/>
			<ArtifactListField
				label={'Web links'}
				value={[
					...editedArtifact.vanilla_links,
					...editedArtifact.file_links
				].join(', ')}
				onAdd={() => handleAddItem('web_links')}
			/>
			<ArtifactListField
				label="Files"
				value={editedArtifact.files.join(', ')}
				onAdd={() => handleAddItem('files')}
			/>
			<ArtifactListField
				label="Captured Documents"
				value={editedArtifact.captured_documents
					.map(doc => doc.captured_document_id)
					.join(', ')}
				onAdd={() => handleAddItem('captured_documents')}
			/>
		</div>
	);
}

interface ArtifactListFieldProps {
	label: string;
	value: string;
	onAdd: () => void;
	error?: string;
}

function ArtifactListField({
	label,
	value,
	onAdd,
	error
}: ArtifactListFieldProps) {
	return (
		<div className="flex flex-col space-y-1.5 text-sm">
			<div className="flex items-center justify-between">
				<Label>{label}</Label>
				<Button
					variant="ghost"
					size="sm"
					onClick={onAdd}
					className="h-8 px-2"
				>
					<Plus className="mr-1 h-4 w-4" />
					Add
				</Button>
			</div>
			<div className="rounded-md bg-secondary p-2">{value}</div>
		</div>
	);
}

interface ArtifactEditFieldProps {
	label: string;
	name: string;
	value: string;
	onChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	isTextarea?: boolean;
	error?: string;
}

function ArtifactEditField({
	label,
	name,
	value,
	onChange,
	isTextarea = false,
	error
}: ArtifactEditFieldProps) {
	return (
		<div className="flex flex-col space-y-1.5 text-sm">
			<Label htmlFor={name}>{label}</Label>
			{isTextarea ? (
				<Textarea
					id={name}
					name={name}
					value={value}
					onChange={onChange}
					className={cn(
						error &&
							'border-destructive placeholder:text-destructive'
					)}
					placeholder={error}
				/>
			) : (
				<Input
					id={name}
					name={name}
					value={value}
					onChange={onChange}
					className={cn(
						error &&
							'border-destructive placeholder:text-destructive'
					)}
					placeholder={error}
				/>
			)}
		</div>
	);
}
