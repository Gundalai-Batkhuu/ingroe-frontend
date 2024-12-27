import React, { useState } from 'react';
import { TextInputWithClearButton } from '@/components/ui/text-input-with-clear-button';
import { documentService } from '@/services/document-service';

interface ManualDocumentUploaderProps {
	userId: string;
}

export const ManualDocumentUploader = ({
	userId
}: ManualDocumentUploaderProps) => {
	const [file, setFile] = useState<File | null>(null);
	const [link, setLink] = useState('');
	const [documentId, setDocumentId] = useState('');
	const [documentAlias, setDocumentAlias] = useState('');
	const [description, setDescription] = useState('');
	const [message, setMessage] = useState('');

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setFile(event.target.files[0]);
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setMessage('');

		if (!file && !link) {
			setMessage('Please provide either a file or a link');
			return;
		}

		const submitFormData = new FormData();
		if (file) submitFormData.append('file', file);
		if (link) submitFormData.append('link', link);
		submitFormData.append('user_id', userId);
		if (documentId) submitFormData.append('document_id', documentId);
		if (documentAlias)
			submitFormData.append('document_alias', documentAlias);
		if (description) submitFormData.append('description', description);

		// Log the form data sent (excluding file)
		console.log('Form data sent (excluding file):');
		submitFormData.forEach((value, key) => {
			if (key !== 'file') {
				console.log(`${key}: ${value}`);
			}
		});

		try {
			const response =
				await documentService.createDocumentManually(submitFormData);
			setMessage(
				`${response.message} You can upload another file if needed.`
			);
			// Clear form fields after successful upload
			setFile(null);
			setLink('');
			setDocumentId('');
			setDocumentAlias('');
			setDescription('');
			if (event.target instanceof HTMLFormElement) {
				event.target.reset();
			}
		} catch (error) {
			if (error instanceof Error) {
				setMessage(`Error: ${error.message}`);
			} else {
				setMessage('An error occurred while uploading the document');
			}
		}
	};

	return (
		<div className="w-full max-w-md space-y-5 p-4">
			<form onSubmit={handleSubmit} className="space-y-5">
				<div className="mb-6">
					<label
						htmlFor="file"
						className="mb-1 block text-xs font-medium"
					>
						File
					</label>
					<input
						type="file"
						id="file"
						onChange={handleFileChange}
						className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
					/>
					{file && (
						<p className="mt-1 text-xs text-muted-foreground">
							{file.name}
						</p>
					)}
				</div>
				<div className="mb-6">
					<label
						htmlFor="link"
						className="mb-1 block text-xs font-medium"
					>
						Link (optional)
					</label>
					<input
						type="text"
						id="link"
						value={link}
						onChange={e => setLink(e.target.value)}
						className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						placeholder="https://example.com"
					/>
				</div>
				<div className="mb-6">
					<label
						htmlFor="document_id"
						className="mb-1 block text-xs font-medium"
					>
						Document ID (optional)
					</label>
					<input
						type="text"
						id="document_id"
						value={documentId}
						onChange={e => setDocumentId(e.target.value)}
						className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
					/>
				</div>
				<div className="mb-6">
					<label
						htmlFor="document_alias"
						className="mb-1 block text-xs font-medium"
					>
						Title (Optional)
					</label>
					<TextInputWithClearButton
						onChange={setDocumentAlias}
						onKeyPress={() => {}}
					/>
				</div>
				<div className="mb-6">
					<label
						htmlFor="description"
						className="mb-1 block text-xs font-medium"
					>
						Description (Optional)
					</label>
					<TextInputWithClearButton
						onChange={setDocumentAlias}
						onKeyPress={() => {}}
					/>
				</div>
				<button
					type="submit"
					className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
				>
					Upload File
				</button>
			</form>
			{message && (
				<div
					className={`mt-4 rounded-md border p-4 text-sm ${
						message.startsWith('Error')
							? 'border-destructive bg-destructive/15 text-destructive'
							: 'border-primary bg-primary/15 text-primary'
					}`}
				>
					{message}
				</div>
			)}
		</div>
	);
};
