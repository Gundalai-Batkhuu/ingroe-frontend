'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface WorkerCreationSuccessDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

export function WorkerCreationSuccessDialog({
	isOpen,
	onOpenChange
}: WorkerCreationSuccessDialogProps) {
	const router = useRouter();

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<div className="flex flex-col items-center">
					<Image
						src="/action_success.png"
						alt="Success"
						width={256}
						height={256}
						className="my-4"
					/>
				</div>
				<DialogHeader>
					<DialogTitle className="text-center text-2xl font-semibold">
						New assistant created!
					</DialogTitle>
				</DialogHeader>
				<Button
					className="text-md w-full bg-slate-900 text-white hover:bg-slate-800"
					onClick={() => router.push('/manage-assistants')}
				>
					Go to Assistants hub
				</Button>
			</DialogContent>
		</Dialog>
	);
}
