import React, { useState, useEffect } from 'react';
import { SearchResult } from '@/lib/types';
import { truncateText } from '@/lib/utils';
import { useResourceItemsStore } from '@/features/worker-creation/stores/useResourceItemsStore';

interface SearchResultsListProps {
	searchResults: SearchResult[];
}

export const SearchResultsList = ({
	searchResults
}: SearchResultsListProps) => {
	const { addResourceItem, removeResourceItem, resourceItems } =
		useResourceItemsStore();
	const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

	useEffect(() => {
		setSelectedItems(
			new Set(resourceItems.map(item => item.content as string))
		);
	}, [resourceItems]);

	const handleToggle = (result: SearchResult) => {
		if (selectedItems.has(result.link)) {
			const itemToRemove = resourceItems.find(
				item => item.content === result.link
			);
			if (itemToRemove) {
				removeResourceItem(itemToRemove.id);
			}
		} else {
			addResourceItem('link', result.link);
		}
	};

	return (
		<div className="mx-auto mt-8 max-w-2xl">
			{searchResults.map((result, index) => (
				<div
					key={index}
					className="mb-12 flex items-center justify-between"
				>
					<div className="grow pr-4">
						<div className="mb-1 flex items-center">
							{result.thumbnail && (
								<img
									src={result.thumbnail}
									alt=""
									className="mr-2 size-8 rounded-full"
								/>
							)}
							<div className="overflow-hidden">
								<a
									href={result.link}
									className="text-overflow-ellipsis block overflow-hidden whitespace-nowrap text-sm text-primary/80 hover:underline"
									title={result.link}
									target="_blank"
									rel="noopener noreferrer"
								>
									{truncateText(result.link, 80)}
								</a>
							</div>
						</div>
						<h3 className="mb-1 text-xl">
							<a
								href={result.link}
								className="text-blue-500 hover:underline"
								target="_blank"
								rel="noopener noreferrer"
							>
								{result.title}
							</a>
						</h3>
						<p
							className="text-sm text-primary/70"
							dangerouslySetInnerHTML={{
								__html: result.html_snippet || result.snippet
							}}
						/>
					</div>
					<div className="shrink-0">
						<input
							type="checkbox"
							className="size-6 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
							checked={selectedItems.has(result.link)}
							onChange={() => handleToggle(result)}
						/>
					</div>
				</div>
			))}
		</div>
	);
};
