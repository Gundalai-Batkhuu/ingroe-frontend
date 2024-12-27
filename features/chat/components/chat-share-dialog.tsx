'use client';

import * as React from 'react';
import { type DialogProps } from '@radix-ui/react-dialog';
import { useToast } from '@/components/hooks/use-toast';

import { ServerActionResult, type Chat } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

interface ChatShareDialogProps extends DialogProps {
	chat: Pick<Chat, 'id' | 'title' | 'messages'>;
	shareChat: (id: string) => ServerActionResult<Chat>;
	onCopy: () => void;
}

export function ChatShareDialog({
	chat,
	shareChat,
	onCopy,
	...props
}: ChatShareDialogProps) {
	const { toast } = useToast();
	const { copyToClipboard } = useCopyToClipboard({ timeout: 1000 });
	const [isSharePending, startShareTransition] = React.useTransition();

	const copyShareLink = React.useCallback(
		async (chat: Chat) => {
			if (!chat.sharePath) {
				return toast({
					variant: 'destructive',
					title: 'Error',
					description: 'Could not copy share link to clipboard'
				});
			}

			const url = new URL(window.location.href);
			url.pathname = chat.sharePath;
			copyToClipboard(url.toString());
			onCopy();
			toast({
				title: 'Success',
				description: 'Share link copied to clipboard'
			});
		},
		[copyToClipboard, onCopy, toast]
	);

	return (
		<Dialog {...props}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Share link to chat</DialogTitle>
					<DialogDescription>
						Anyone with the URL will be able to view the shared
						chat.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-1 rounded-md border p-4 text-sm">
					<div className="font-medium">{chat.title}</div>
					<div className="text-muted-foreground">
						{chat.messages.length} messages
					</div>
				</div>
				<DialogFooter className="items-center">
					<Button
						disabled={isSharePending}
						onClick={() => {
							startShareTransition(async () => {
								const result = await shareChat(chat.id);

								if (result && 'error' in result) {
									toast({
										variant: 'destructive',
										title: 'Error',
										description: result.error
									});
									return;
								}

								copyShareLink(result);
							});
						}}
					>
						{isSharePending ? (
							<>
								<Loader2 className="mr-2 animate-spin" />
								Copying...
							</>
						) : (
							<>Copy link</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
