'use client';

import { Copy, Check } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { cn } from '@/lib/utils';

interface ChatMessageActionsProps extends React.ComponentProps<'div'> {
	message: string;
}

export function ChatMessageActions({
	message,
	className,
	...props
}: ChatMessageActionsProps) {
	const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });

	const onCopy = () => {
		if (isCopied) return;
		copyToClipboard(message);
	};

	return (
		<div className={cn('mt-2', className)} {...props}>
			<button onClick={onCopy}>
				{isCopied ? (
					<Check className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700" />
				) : (
					<Copy className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700" />
				)}
				<span className="sr-only">Copy message</span>
			</button>
		</div>
	);
}
