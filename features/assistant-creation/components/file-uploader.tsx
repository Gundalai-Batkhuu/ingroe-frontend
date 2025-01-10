'use client';

import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FileWithPath } from 'react-dropzone';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FileUploaderProps {
	onFileUpload: (files: FileWithPath[]) => void;
}

const SUPPORTED_EXTENSIONS = [
	'.md',
	'.pdf',
	'.docx',
	'.txt',
	'.csv',
	'.xlsx',
	'.xls'
];

function isSupportedFileType(file: File): boolean {
	const extension = '.' + file.name.split('.').pop()?.toLowerCase();
	return SUPPORTED_EXTENSIONS.includes(extension);
}

export function FileUploader({ onFileUpload }: FileUploaderProps) {
	const [unsupportedCount, setUnsupportedCount] = useState(0);
	const [supportedCount, setSupportedCount] = useState(0);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const dirInputRef = useRef<HTMLInputElement>(null);

	const processEntry = async (entry: FileSystemEntry): Promise<File[]> => {
		if (entry.isFile) {
			return new Promise(resolve => {
				(entry as FileSystemFileEntry).file(file => resolve([file]));
			});
		} else if (entry.isDirectory) {
			const dirReader = (
				entry as FileSystemDirectoryEntry
			).createReader();
			return new Promise(resolve => {
				dirReader.readEntries(async entries => {
					const files = await Promise.all(entries.map(processEntry));
					resolve(files.flat());
				});
			});
		}
		return [];
	};

	const handleFiles = async (items: DataTransferItemList | FileList) => {
		let allFiles: File[] = [];

		if (items instanceof FileList) {
			allFiles = Array.from(items);
		} else {
			const entries = Array.from(items)
				.filter(item => item.kind === 'file')
				.map(item => item.webkitGetAsEntry())
				.filter((entry): entry is FileSystemEntry => entry !== null);

			const processedFiles = await Promise.all(entries.map(processEntry));
			allFiles = processedFiles.flat();
		}

		const supportedFiles = allFiles.filter(
			isSupportedFileType
		) as FileWithPath[];
		setUnsupportedCount(allFiles.length - supportedFiles.length);
		setSupportedCount(supportedFiles.length);
		onFileUpload(supportedFiles);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		handleFiles(e.dataTransfer.items);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			handleFiles(e.target.files);
		}
	};

	const handleSelectFiles = () => {
		fileInputRef.current?.click();
	};

	const handleSelectDirectories = () => {
		dirInputRef.current?.click();
	};

	return (
		<Card className="h-full w-full border-0 shadow-none">
			<CardHeader>
				<CardTitle>Upload knowledge files</CardTitle>
			</CardHeader>
			<CardContent>
				<div
					className="text-center"
					onDragOver={e => e.preventDefault()}
					onDrop={handleDrop}
				>
					<Input
						type="file"
						onChange={handleFileChange}
						multiple
						className="hidden"
						ref={fileInputRef}
						accept={SUPPORTED_EXTENSIONS.join(',')}
					/>
					<Input
						type="file"
						onChange={handleFileChange}
						multiple
						className="hidden"
						ref={dirInputRef}
						webkitdirectory=""
						directory=""
					/>
					<Image
						src="/upload_documents.png"
						alt="Upload"
						width={128}
						height={128}
						className="mx-auto mb-6"
					/>
					<h2 className="mb-2 text-lg font-semibold">
						Drag & Drop here to upload
					</h2>
					<p className="mb-6 text-sm text-muted-foreground">
						or use the buttons below to select
					</p>
					<div className="flex justify-center space-x-4">
						<Button variant="default" onClick={handleSelectFiles}>
							<Upload className="mr-2 size-4" />
							Upload File
						</Button>
						<Button
							variant="default"
							onClick={handleSelectDirectories}
						>
							<Upload className="mr-2 size-4" />
							Upload Folder
						</Button>
					</div>
					<p className="mt-6 text-xs text-muted-foreground">
						Supported file types: {SUPPORTED_EXTENSIONS.join(', ')}
					</p>
				</div>
				{(unsupportedCount > 0 || supportedCount > 0) && (
					<Alert variant="default" className="mt-4 border-0">
						<AlertDescription>
							{unsupportedCount > 0 &&
								`${unsupportedCount} unsupported file${unsupportedCount > 1 ? 's were' : ' was'} ignored. `}
							{supportedCount > 0 &&
								`${supportedCount} supported file${supportedCount > 1 ? 's have' : ' has'} been uploaded successfully.`}
							{supportedCount === 0 &&
								'No supported files were uploaded.'}
						</AlertDescription>
					</Alert>
				)}
			</CardContent>
		</Card>
	);
}
