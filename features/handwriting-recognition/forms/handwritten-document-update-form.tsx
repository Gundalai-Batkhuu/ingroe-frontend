import React, { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { documentService } from '@/services/document-service';

interface HandwrittenDocumentUpdateFormProps {
	userId: string;
	documentId: string;
	fileId: string;
	capturedDocumentId: string;
	editedText: string;
	fileName: string;
}

function HandwrittenDocumentUpdateForm({
	userId,
	documentId,
	fileId,
	capturedDocumentId,
	editedText,
	fileName
}: HandwrittenDocumentUpdateFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const [file, setFile] = useState<File | null>(null);

	useEffect(() => {
		const blob = new Blob([editedText], { type: 'text/plain' });

		// Change the file extension to .txt
		const newFileName = fileName.replace(/\.[^/.]+$/, '.txt');

		const newFile = new File([blob], newFileName, { type: 'text/plain' });
		setFile(newFile);
	}, [editedText, fileName]);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSubmitError(null);
		setSubmitSuccess(false);

		const formData = new FormData();
		formData.append('user_id', userId);
		formData.append('document_id', documentId);
		formData.append('file_id', fileId);
		formData.append('captured_document_id', capturedDocumentId);
		if (file) {
			formData.append('file', file);
		}

		console.log('Form data contents:');
		Array.from(formData.entries()).forEach(([key, value]) => {
			console.log(key, value);
		});

		try {
			const response =
				await documentService.updateCaptureDocument(formData);
			console.log('Update response:', response);
			setSubmitSuccess(true);
		} catch (error) {
			console.error('Error updating document:', error);
			setSubmitError(
				'An error occurred while updating the document. Please try again.'
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{submitError && <p className="text-red-500">{submitError}</p>}

			{submitSuccess && (
				<p className="text-green-500">Document updated successfully!</p>
			)}

			<Button type="submit" disabled={isSubmitting}>
				{isSubmitting ? 'Updating...' : 'Update Document'}
			</Button>
		</form>
	);
}

export default HandwrittenDocumentUpdateForm;
