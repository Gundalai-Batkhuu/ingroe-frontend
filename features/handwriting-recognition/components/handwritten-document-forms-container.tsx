import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import HandwrittenDocumentUploadForm from '@/features/handwriting-recognition/forms/handwritten-document-upload-form';
import HandwrittenDocumentUpdateForm from '@/features/handwriting-recognition/forms/handwritten-document-update-form';

interface SidebarHandwrittenProps extends React.ComponentProps<'div'> {
	userId: string;
	setText: (text: string) => void;
	setEditedText: (text: string) => void;
	editedText: string;
}

export function HandwrittenDocumentFormsContainer({
	userId,
	className,
	setEditedText,
	setText,
	editedText
}: SidebarHandwrittenProps) {
	const [capturedDocumentId, setCapturedDocumentId] = useState('');
	const [documentId, setDocumentId] = useState('');
	const [fileId, setFileId] = useState('');
	const [fileName, setFileName] = useState('');

	return (
		<div
			className={cn(
				className,
				'h-full flex-col dark:bg-zinc-950',
				'transition-transform duration-300 ease-in-out'
			)}
		>
			<div className="inset-y-0 flex h-full flex-col overflow-hidden border-r bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl lg:w-[250px] xl:w-[300px]">
				<div className="size-full overflow-y-auto">
					<HandwrittenDocumentUploadForm
						userId={userId}
						setCapturedDocumentId={setCapturedDocumentId}
						setDocumentId={setDocumentId}
						setFileId={setFileId}
						setText={setText}
						setEditedText={setEditedText}
						setFileName={setFileName}
					/>

					<HandwrittenDocumentUpdateForm
						userId={userId}
						capturedDocumentId={capturedDocumentId}
						documentId={documentId}
						fileId={fileId}
						editedText={editedText}
						fileName={fileName}
					/>
				</div>
			</div>
		</div>
	);
}
