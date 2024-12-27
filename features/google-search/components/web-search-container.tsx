'use client';

import React, { useState } from 'react';
import { SearchBar } from '@/features/google-search/components/search-bar';
import { SearchResultsList } from '@/features/google-search/components/search-results-list';
import { AdvancedSearchOptions } from '@/features/google-search/components/advanced-search-options';
import { CountryShortName } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useResourceItemsStore } from '@/features/worker-creation/stores/useResourceItemsStore';

interface WebSearchContainerProps {
	userId: string;
}

export default function WebSearchContainer({
	userId
}: WebSearchContainerProps) {
	const [searchResults, setSearchResults] = useState([]);
	const [country, setCountry] = useState<CountryShortName>('AU');
	const [countrySpecificSearch, setCountrySpecificSearch] = useState(true);
	const [searchType, setSearchType] = useState<'strict' | 'medium' | 'open'>(
		'medium'
	);
	const [fileType, setFileType] = useState<'pdf' | 'docx' | undefined>(
		undefined
	);
	const [results, setResults] = useState(10);
	const [before, setBefore] = useState<number | undefined>(undefined);
	const [after, setAfter] = useState<number | undefined>(undefined);
	const [site, setSite] = useState<string | undefined>(undefined);
	const [linkInput, setLinkInput] = useState<string>('');
	const { addResourceItem } = useResourceItemsStore();

	const handleLinkAdd = (e: React.FormEvent) => {
		e.preventDefault();
		if (linkInput.trim()) {
			addResourceItem('link', linkInput.trim());
			setLinkInput('');
		}
	};

	return (
		<div className="flex flex-col space-y-6 px-10 pt-6">
			<h2 className="text-sm font-semibold">Add Web Links</h2>
			<form
				onSubmit={handleLinkAdd}
				className="flex items-center space-x-2"
			>
				<Input
					type="url"
					placeholder="Enter URL"
					value={linkInput}
					onChange={e => setLinkInput(e.target.value)}
					className="flex-1"
				/>
				<Button type="submit" size="icon" aria-label="Add link">
					<Plus className="size-4" />
				</Button>
			</form>
			<AdvancedSearchOptions
				country={country}
				setCountry={setCountry}
				countrySpecificSearch={countrySpecificSearch}
				setCountrySpecificSearch={setCountrySpecificSearch}
				searchType={searchType}
				setSearchType={setSearchType}
				fileType={fileType}
				setFileType={setFileType}
				results={results}
				setResults={setResults}
				before={before}
				setBefore={setBefore}
				after={after}
				setAfter={setAfter}
				site={site}
				setSite={setSite}
				userId={userId}
			/>
			<SearchBar
				setSearchResults={setSearchResults}
				country={country}
				countrySpecificSearch={countrySpecificSearch}
				searchType={searchType}
				fileType={fileType}
				results={results}
				before={before}
				after={after}
				site={site}
			/>
			<SearchResultsList searchResults={searchResults} />
		</div>
	);
}
