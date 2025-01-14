import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import { Copy, BookMarked } from 'lucide-react';
import { Context } from '@/lib/types';

interface InformationSourceDisplayProps {
	context?: Context[];
	chunkid?: string[];
	message?: string;
}

export default function InformationSourceDisplay({
	context,
	chunkid,
	message
}: InformationSourceDisplayProps) {
	const filteredContext = context?.filter(ctx =>
		chunkid?.includes(ctx.metadata.chunkid)
	);

	return (
		<Dialog>
			<DialogTrigger>
				<div>
					<IconWrapper tooltip="Source">
						<BookMarked className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700" />
					</IconWrapper>
				</div>
			</DialogTrigger>
			<DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold">AI Response</DialogTitle>
					<DialogDescription>
						{message && (
							<div className="mb-4 mt-2">
								<p className="text-sm leading-relaxed text-gray-600">
									{message}
								</p>
							</div>
						)}
					</DialogDescription>
				</DialogHeader>
				<p className="mb-4 text-lg font-semibold text-primary">
					Source Extracts
				</p>
				{filteredContext?.length ? (
					<div className="mt-2 space-y-6">
						{filteredContext.map((context, index) => (
							<div key={index} className="rounded-lg border bg-gray-50/50 p-5 shadow-sm">
								<div className="mb-3 flex items-center gap-2">
									<BookMarked className="h-4 w-4 text-primary" />
									<p className="text-sm font-medium text-gray-700">
										{context.metadata.chunkid.split(':')[0]}{' '}
										(Page {context.metadata.chunkid.split(':')[1]})
									</p>
								</div>
								<p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
									{context.page_content}
								</p>
								<div className="mt-4 flex items-center justify-between text-gray-600">
									<p className="text-sm">Source: {context.metadata.source}</p>
									<IconWrapper tooltip="Copy source">
										<button
											onClick={() => navigator.clipboard.writeText(context.metadata.source)}
											className="rounded p-1.5 hover:bg-gray-100 transition-colors"
										>
											<Copy className="h-4 w-4" />
										</button>
									</IconWrapper>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-gray-500">
						This message was generated without referencing any specific documents.
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
