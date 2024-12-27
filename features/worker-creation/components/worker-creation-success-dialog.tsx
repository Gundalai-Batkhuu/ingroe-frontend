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
						New worker created!
					</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col items-center space-y-4">
					<p className="text-center text-muted-foreground">
						New worker has been successfully created!
					</p>
					<Button
						className="text-md w-full bg-slate-900 text-white hover:bg-slate-800"
						onClick={() => router.push('/workers')}
					>
						Go to Workers hub
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
