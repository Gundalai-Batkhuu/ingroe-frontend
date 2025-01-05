'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/hooks/use-toast';
import { ServerActionResult } from '@/lib/types';
import { Button, buttonVariants } from '@/components/ui/button';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClearHistoryProps {
	isEnabled: boolean;
	clearChats: () => ServerActionResult<void>;
}

export function ClearHistory({
	isEnabled = false,
	clearChats
}: ClearHistoryProps) {
	const [open, setOpen] = React.useState(false);
	const [isPending, startTransition] = React.useTransition();
	const { toast } = useToast();
	const router = useRouter();

	const handleClearHistory = async (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault();
		startTransition(async () => {
			const result = await clearChats();

			if (result && 'error' in result) {
				toast({
					variant: 'destructive',
					title: 'Error',
					description: result.error
				});
				return;
			}

			toast({
				title: 'Success',
				description: 'Chat history has been cleared'
			});
			setOpen(false);
		});
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button
					className={cn(
						buttonVariants({ variant: 'outline' }),
						'mb-4 h-10 w-full justify-center bg-zinc-50 px-2 px-4 text-zinc-900 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-300/10'
					)}
					disabled={!isEnabled || isPending}
				>
					{isPending && <Loader2 className="mr-2 animate-spin" />}
					Clear history
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you absolutely sure?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This will permanently delete your chat history and
						remove your data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						disabled={isPending}
						onClick={handleClearHistory}
					>
						{isPending && <Loader2 className="mr-2 animate-spin" />}
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
