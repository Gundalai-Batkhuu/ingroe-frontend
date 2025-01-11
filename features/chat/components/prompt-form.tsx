'use client';

import * as React from 'react';
import Textarea from 'react-textarea-autosize';
import { useActions, useUIState, useAIState } from 'ai/rsc';
import { type AI, type AIState } from '@/features/chat/actions/ai-actions';
import { Button } from '@/components/ui/button';
import { IconArrowElbow, IconPlus } from '@/components/ui/icons';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/components/ui/tooltip';
import { useEnterSubmit } from '@/hooks/use-enter-submit';
import { useRouter } from 'next/navigation';

export function PromptForm({
	input,
	setInput,
	onSubmit
}: {
	input: string;
	setInput: (value: string) => void;
	onSubmit: (value: string) => Promise<void>;
}) {
	const router = useRouter();
	const { formRef, onKeyDown } = useEnterSubmit();
	const inputRef = React.useRef<HTMLTextAreaElement>(null);
	const [_, setMessages] = useUIState<typeof AI>();
	const [aiState, setAIState] = useAIState();

	React.useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (window.innerWidth < 600) {
			inputRef.current?.blur();
		}

		const value = input.trim();
		setInput('');
		if (!value) return;

		setAIState((prev: AIState) => ({
			...prev,
			isLoading: true
		}));

		try {
			await onSubmit(value);
		} finally {
			setAIState((prev: AIState) => ({
				...prev,
				isLoading: false
			}));
		}
	};

	return (
		<form ref={formRef} onSubmit={handleSubmit}>
			<div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background pl-2 pr-16 sm:rounded-md">
				<Textarea
					ref={inputRef}
					tabIndex={0}
					onKeyDown={onKeyDown}
					placeholder="Type your query here..."
					className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
					autoFocus
					spellCheck={false}
					autoComplete="off"
					autoCorrect="off"
					name="message"
					rows={1}
					value={input}
					onChange={e => setInput(e.target.value)}
				/>

				{/* Send message button */}
				<div className="absolute right-0 top-[13px] flex items-center space-x-5 sm:right-4">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								type="submit"
								size="icon"
								disabled={input === ''}
							>
								<IconArrowElbow />
								<span className="sr-only">Send message</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>Send message</TooltipContent>
					</Tooltip>
				</div>
			</div>
		</form>
	);
}
