'use client'

import React, { useState } from "react";
import { SearchBar } from "@/app/components/search-bar";
import { SearchResultsList } from "@/app/components/search-results";
import { SidebarSearch } from "@/app/components/sidebar-search";

export default function Home() {
    const [searchResults, setSearchResults] = useState([]);
    const [country, setCountry] = useState<string>("AU");
    const [countrySpecificSearch, setCountrySpecificSearch] = useState<boolean>(true);
    const [searchType, setSearchType] = useState<"strict" | "medium" | "open">("medium");
    const [fileType, setFileType] = useState<string | null>(null);
    const [mix, setMix] = useState<boolean>(false);
    const [results, setResults] = useState<number>(10);
    const [before, setBefore] = useState<number | null>(null);
    const [after, setAfter] = useState<number | null>(null);
    const [site, setSite] = useState<string | null>(null);

    return (
        <div className="flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
            <SidebarSearch
                country={country}
                setCountry={setCountry}
                countrySpecificSearch={countrySpecificSearch}
                setCountrySpecificSearch={setCountrySpecificSearch}
                searchType={searchType}
                setSearchType={setSearchType}
                fileType={fileType}
                setFileType={setFileType}
                mix={mix}
                setMix={setMix}
                results={results}
                setResults={setResults}
                before={before}
                setBefore={setBefore}
                after={after}
                setAfter={setAfter}
                site={site}
                setSite={setSite}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col min-h-full p-6">
                    <div className="flex-grow flex flex-col items-center justify-center space-y-8 max-w-4xl mx-auto">
                        <h1 className="text-4xl font-bold">Welcome to the Legal AI App!</h1>
                        <p className="text-lg text-center">
                            Get started by choosing a country and searching with keywords to find legal information.
                        </p>
                        <div className="w-full max-w-md">
                            <SearchBar
                                placeholder="Type your keywords here ..."
                                setResults={setSearchResults}
                                country={country}
                                countrySpecificSearch={countrySpecificSearch}
                                searchType={searchType}
                                fileType={fileType}
                                mix={mix}
                                results={results}
                                before={before}
                                after={after}
                                site={site}
                            />
                        </div>
                    </div>
                    <div className="w-full max-w-4xl mx-auto mt-8">
                        <SearchResultsList results={searchResults}/>
                    </div>
                </div>
            </div>
        </div>
    );
}