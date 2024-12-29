'use client';

import { IconAI, IconUser } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { spinner } from '@/components/ui/icons';
import { CodeBlock } from '@/components/ui/codeblock';
import { MemoizedReactMarkdown } from '@/components/markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { StreamableValue } from 'ai/rsc';
import { useStreamableText } from '@/hooks/use-streamable-text';
import ChatToolCollection from '@/features/chat/components/chat-tool-collection';
import { Context } from '@/lib/types';

export function UserMessage({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex justify-end space-y-2 overflow-hidden">
			<div className="rounded-md bg-green-100 p-4">{children}</div>
		</div>
	);
}

interface BotMessageProps {
	content: string | StreamableValue<string>;
	context?: Context[];
	chunkid?: string[];
}

export function BotMessage({ content, context, chunkid }: BotMessageProps) {
	const text = useStreamableText(content);

	return (
		<div
			className={cn(
				'group relative my-4 flex items-start md:-ml-12',
				chunkid
			)}
		>
			<div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
				<IconAI />
			</div>
			<div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
				<MemoizedReactMarkdown
					className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
					remarkPlugins={[remarkGfm, remarkMath]}
					components={{
						p({ children }) {
							return <p className="mb-2 last:mb-0">{children}</p>;
						},
						code({ node, inline, className, children, ...props }) {
							if (children.length) {
								if (children[0] == '▍') {
									return (
										<span className="mt-1 animate-pulse cursor-default">
											▍
										</span>
									);
								}

								children[0] = (children[0] as string).replace(
									'`▍`',
									'▍'
								);
							}

							const match = /language-(\w+)/.exec(
								className || ''
							);

							if (inline) {
								return (
									<code className={className} {...props}>
										{children}
									</code>
								);
							}

							return (
								<CodeBlock
									key={Math.random()}
									language={(match && match[1]) || ''}
									value={String(children).replace(/\n$/, '')}
									{...props}
								/>
							);
						}
					}}
				>
					{text}
				</MemoizedReactMarkdown>
				<div className="flex items-center justify-between">
					<ChatToolCollection
						message={text}
						context={context}
						chunkid={chunkid}
					/>
				</div>
			</div>
		</div>
	);
}

export function SystemMessage({ children }: { children: React.ReactNode }) {
	return (
		<div className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-500">
			<div className="max-w-[600px] flex-initial p-2">{children}</div>
		</div>
	);
}

export function SpinnerMessage() {
	return (
		<div className="group relative flex items-start md:-ml-12">
			<div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
				<IconAI />
			</div>
			<div className="ml-4 flex h-[24px] flex-1 flex-row items-center space-y-2 overflow-hidden px-1">
				{spinner}
			</div>
		</div>
	);
}
