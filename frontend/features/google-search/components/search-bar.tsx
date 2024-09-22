import React, { useState, FormEvent } from 'react';
import { COUNTRIES, Country } from "@/data/countries";
import { TextInputWithClearButton } from '@/components/ui/text-input-with-clear-button';
import { SearchQuery } from '@/lib/types'
import { documentService } from '@/services/document-service'

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
        return (
          <form onSubmit={handleSearch} className="flex items-stretch">
              <div className="grow">
                  <TextInputWithClearButton
                    placeholder="Type your keywords here ..."
                    onChange={setQuery}
                  />
              </div>
              <button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 rounded-r-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1 transition duration-150 ease-in-out flex items-center"
              >
                  Search
              </button>
          </form>
        )
}