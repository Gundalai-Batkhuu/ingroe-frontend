import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, WandSparkles, RefreshCw } from 'lucide-react';
import DiscussionForm from '@/features/chat/components/discussion-form';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import InformationSourceDisplay from '@/features/information-source/information-source-display';
import { Context } from '@/lib/types';
import { ChatMessageActions } from './chat-message-actions';
const cn = (...classes: (string | undefined)[]): string =>
	classes.filter(Boolean).join(' ');

interface ChatToolCollectionProps {
	className?: string;
	message?: string;
	context?: Context[];
	chunkid?: string[];
}

export default function ChatToolCollection({
	className,
	message,
	context,
	chunkid
}: ChatToolCollectionProps) {
	const [isLiked, setIsLiked] = useState(false);
	const [isDisliked, setIsDisliked] = useState(false);

	const handleLike = () => {
		setIsLiked(!isLiked);
		if (isDisliked) setIsDisliked(false);
	};

	const handleDislike = () => {
		setIsDisliked(!isDisliked);
		if (isLiked) setIsLiked(false);
	};

	return (
		<div
			className={cn(
				'flex items-center space-x-4 transition-opacity group-hover:opacity-100 md:opacity-0',
				'mt-2',
				className
			)}
		>
			<IconWrapper tooltip={isLiked ? 'Unlike' : 'Like'}>
				<ThumbsUp
					className={cn(
						'h-5 w-5 cursor-pointer',
						isLiked
							? 'text-blue-500 hover:text-blue-600'
							: 'text-gray-500 hover:text-gray-700'
					)}
					onClick={handleLike}
				/>
			</IconWrapper>
			<IconWrapper tooltip={isDisliked ? 'Undo dislike' : 'Dislike'}>
				<ThumbsDown
					className={cn(
						'h-5 w-5 cursor-pointer',
						isDisliked
							? 'text-red-500 hover:text-red-600'
							: 'text-gray-500 hover:text-gray-700'
					)}
					onClick={handleDislike}
				/>
			</IconWrapper>
			<IconWrapper tooltip="Do something magical">
				<WandSparkles className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700" />
			</IconWrapper>
			<InformationSourceDisplay
				context={context || []}
				chunkid={chunkid}
				message={message}
			/>
			<IconWrapper tooltip="Copy message">
				<ChatMessageActions message={message || ''} />
			</IconWrapper>
			<IconWrapper tooltip="Create a new discussion">
				<DiscussionForm />
			</IconWrapper>
			<IconWrapper tooltip="Refresh">
				<RefreshCw className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700" />
			</IconWrapper>
		</div>
	);
}
