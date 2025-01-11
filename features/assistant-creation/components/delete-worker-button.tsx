import React from 'react';
import { DeleteWorker } from '@/lib/types';
import { documentService } from '@/services/document-service';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

interface DeleteWorkerButtonProps extends DeleteWorker {
	onSuccess?: () => void;
	documentName: string;
}

export const DeleteWorkerButton = ({
	user_id,
	document_id,
	onSuccess,
	documentName
}: DeleteWorkerButtonProps) => {
	const [isOpen, setIsOpen] = React.useState(false);
	const [confirmationText, setConfirmationText] = React.useState("");
	
	const handleDelete = async () => {
		try {
			const worker = {
				user_id,
				document_id
			};
			
			await documentService.deleteDocument(worker);
			setIsOpen(false);
			if (onSuccess) {
				onSuccess();
			}
		} catch (error) {
			console.error('Error during document deletion:', error);
		}
	};

	return (
		<TooltipProvider>
			<Tooltip>
				<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
					<TooltipTrigger asChild>
						<AlertDialogTrigger asChild>
							<Button variant="destructive" size="smIcon">
								<Trash className="size-4" />
							</Button>
						</AlertDialogTrigger>
					</TooltipTrigger>
					
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Delete Assistant</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. Please type <span className="font-semibold">{documentName}</span> to confirm.
							</AlertDialogDescription>
						</AlertDialogHeader>
						
						<Input
							value={confirmationText}
							onChange={(e) => setConfirmationText(e.target.value)}
							placeholder="Type the document name to confirm"
							className="my-4"
						/>
						
						<AlertDialogFooter>
							<Button variant="outline" onClick={() => setIsOpen(false)}>
								Cancel
							</Button>
							<Button
								variant="destructive"
								onClick={handleDelete}
								disabled={confirmationText !== documentName}
							>
								Delete
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
				
				<TooltipContent className="bg-background text-foreground border">
					<p>Delete Assistant</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default DeleteWorkerButton;
