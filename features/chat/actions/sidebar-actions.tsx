'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { ServerActionResult, type Chat } from '@/lib/types';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '../../../components/ui/alert-dialog';
import { Button } from '../../../components/ui/button';
import { IconShare, IconTrash } from '@/components/ui/icons';
import { ChatShareDialog } from '@/features/chat/components/chat-share-dialog';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '../../../components/ui/tooltip';
import { useToast } from '@/components/hooks/use-toast';
import { convertDate } from '@/components/hooks/convert-date';

interface SidebarActionsProps {
	chat: Chat;
	removeChat: (args: {
		id: string;
		path: string;
	}) => ServerActionResult<void>;
	shareChat: (id: string) => ServerActionResult<Chat>;
}

export function SidebarActions({
	chat,
	removeChat,
	shareChat
}: SidebarActionsProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
	const [shareDialogOpen, setShareDialogOpen] = React.useState(false);
	const [isRemovePending, startRemoveTransition] = React.useTransition();

	const handleDeleteChat = React.useCallback(async () => {
		const result = await removeChat({
			id: chat.id,
			path: chat.path
		});

		if (result && 'error' in result) {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: result.error
			});
			return;
		}

		setDeleteDialogOpen(false);
		router.refresh();
		router.push('/chat');
		toast({
			description: 'Chat deleted successfully'
		});
	}, [chat.id, chat.path, removeChat, router, toast]);

	return (
		<>
			<div className="flex items-center gap-1">
				{/* <Tooltip>
					<TooltipTrigger asChild>
						<span className="cursor-default pr-1 text-xs text-muted-foreground hover:text-foreground">
							{convertDate(chat.createdAt)}
						</span>
					</TooltipTrigger>
					<TooltipContent side="top" align="center">
						Created at: {new Date(chat.createdAt).toLocaleString()}
					</TooltipContent>
				</Tooltip> */}
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							className="size-7 p-0 hover:bg-background"
							onClick={() => setShareDialogOpen(true)}
						>
							<IconShare />
							<span className="sr-only">Share</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent side="top" align="center">
						Share chat
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							className="size-7 p-0 hover:bg-background"
							disabled={isRemovePending}
							onClick={() => setDeleteDialogOpen(true)}
						>
							<IconTrash />
							<span className="sr-only">Delete</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>Delete chat</TooltipContent>
				</Tooltip>
			</div>
			<ChatShareDialog
				chat={chat}
				shareChat={shareChat}
				open={shareDialogOpen}
				onOpenChange={setShareDialogOpen}
				onCopy={() => setShareDialogOpen(false)}
			/>
			<AlertDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you absolutely sure?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete your chat message and
							remove your data from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isRemovePending}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							disabled={isRemovePending}
							onClick={event => {
								event.preventDefault();
								startRemoveTransition(handleDeleteChat);
							}}
						>
							{isRemovePending && (
								<Loader2 className="mr-2 animate-spin" />
							)}
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
