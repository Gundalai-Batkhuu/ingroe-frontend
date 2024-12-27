import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Artefact } from '@/lib/types';
import { Card } from '@/components/ui/card';
import EditDocumentButton from '@/features/chat/components/editDocumentButton';

interface UserArtifactProps {
	artifact: Artefact;
	isExpanded: boolean;
	isSelected: boolean;
	onToggleExpand: () => void;
	onSelect: () => void;
	userId: string;
	onDelete: () => void;
}

const truncateString = (str: string, maxLength: number) => {
	return str.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str;
};

export function UserArtifact({
	artifact,
	isExpanded,
	isSelected,
	onToggleExpand,
	onSelect,
	userId,
	onDelete
}: UserArtifactProps) {
	return (
		<Card
			className={`cursor-pointer ${
				isSelected ? 'bg-accent' : ''
			} rounded border p-2`}
		>
			<div className="flex items-center justify-between space-x-2 text-sm">
				<div className="flex flex-grow items-center space-x-2">
					<button
						onClick={onToggleExpand}
						className="flex-shrink-0 p-1"
					>
						{isExpanded ? (
							<ChevronDown size={16} />
						) : (
							<ChevronRight size={16} />
						)}
					</button>
					<div
						className={`cursor-pointer ${
							isSelected ? 'font-bold' : ''
						} truncate`}
						onClick={onSelect}
						title={artifact.document_id}
					>
						{artifact.document_id === ''
							? truncateString(artifact.document_id, 20)
							: truncateString(artifact.document_name, 20)}
					</div>
				</div>
				<EditDocumentButton document_id={artifact.document_id} />
			</div>
			{isExpanded && (
				<div className="ml-6 mt-2 text-sm">
					<p>Description: {artifact.description}</p>
					<p>Vanilla Links: {artifact.vanilla_links.length}</p>
					<p>File Links: {artifact.file_links.length}</p>
					<p>Files: {artifact.files.length}</p>
					<p>
						Captured Documents: {artifact.captured_documents.length}
					</p>
				</div>
			)}
		</Card>
	);
}
