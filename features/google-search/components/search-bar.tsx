import React, { useState, FormEvent, KeyboardEvent } from 'react';
import { COUNTRIES, Country } from "@/data/countries";
import { TextInputWithClearButton } from '@/components/ui/text-input-with-clear-button';
import { SearchQuery } from '@/lib/types'
import { documentService } from '@/services/document-service'
import {Button} from "@/components/ui/button";

type SearchBarProps = {
    setResults: (value: any) => void;
    country: string;
    countrySpecificSearch: boolean;
    searchType: "strict" | "medium" | "open";
    fileType?: "pdf" | "docx";
    results: number;
    before?: number;
    after?: number;
    site?: string;
};

export const SearchBar = ({
    setResults,
    country,
    countrySpecificSearch,
    searchType,
    fileType,
    results,
    before,
    after,
    site
}: SearchBarProps) => {

    const [query, setQuery] = useState("");
    const selectedCountry = COUNTRIES.find((option: Country) => option.value === country)?.title ?? '';

    const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const searchQuery: SearchQuery = {
        query,
        country: selectedCountry,
        country_specific_search: countrySpecificSearch,
        search_type: searchType,
        file_type: fileType,
        results,
        before,
        after,
        site,
        mix: false
        };

        const response = await documentService.searchDocuments(searchQuery);
        console.log(response);
        setResults(response.results);
    }

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch(e as unknown as FormEvent<HTMLFormElement>);
        }
    }

    return (
        <form onSubmit={handleSearch} className="w-full max-w-4xl mx-auto">
            <div className="flex items-stretch">
                <div className="grow w-full rounded-md">
                    <TextInputWithClearButton
                        placeholder="Type your keywords here ..."
                        onChange={setQuery}
                        onKeyPress={handleKeyPress}
                    />
                </div>
            </div>
        </form>
    )
}
