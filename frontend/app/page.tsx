'use client'

import React, {useState} from "react";
import CountrySelector from "@/app/components/country-selector";
import {COUNTRIES, Country} from "@/app/lib/countries";
import { SearchBar} from "@/app/components/search-bar";
import {SearchResultsList} from "@/app/components/search-results";

export default function Home() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [country, setCountry] = useState<string>("AU");
    const selectedCountry = COUNTRIES.find((option: Country) => option.value === country) || COUNTRIES[0];
    const[searchResults, setSearchResults] = useState([]);

    return (
        <div className="flex flex-col items-center justify-between p-24">
            <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-4xl">
                <h1 className="text-4xl font-bold">Welcome to the Legal AI App!</h1>
                <p className="text-lg text-center">
                    Get started by choosing a country and searching with keywords to find legal information.
                </p>
                <div className="w-2/3 px-5">
                    <SearchBar placeholder="Type your keywords here ..." setResults={setSearchResults} />
                </div>
                <div className="w-96 px-5">
                    <label className="block text-sm font-medium mb-2">
                        Select a country
                    </label>
                    <CountrySelector
                        id="country-selector"
                        open={isOpen}
                        onToggle={() => setIsOpen(!isOpen)}
                        onChange={setCountry}
                        selectedValue={selectedCountry}
                    />
                </div>
                <SearchResultsList results={searchResults}/>
            </div>
        </div>
    );
}