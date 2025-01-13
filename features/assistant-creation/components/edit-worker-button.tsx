import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/components/ui/tooltip';

interface EditWorkerButtonProps {
	documentId: string;
	onEdit: (documentId: string) => void;
}

export function EditWorkerButton({
	documentId,
	onEdit
}: EditWorkerButtonProps) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="destructive"
						size="smIcon"
						onClick={() => onEdit(documentId)}
						className="bg-blue-500 hover:bg-blue-500/90"
					>
						<Pencil className="size-4" />
					</Button>
				</TooltipTrigger>
				<TooltipContent className="border bg-background text-foreground">
					<p>Edit Assistant</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
