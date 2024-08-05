'use client'

import React, {useState} from "react";
import CountrySelector from "@/app/components/country-selector";
import {COUNTRIES} from "@/app/lib/countries";
import SearchBar from "@/app/components/search-bar";

export default function Home() {
    const [isOpen, setIsOpen] = useState(false);
    // Default this to a country's code to preselect it
    const [country, setCountry] = useState("AU");
    const handleSearch = (query) => {
        console.log('Searching for:', query);
        // Implement your search logic here
    };

    return (
        <div className="flex flex-col items-center justify-between p-24">
            <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-4xl">
                <h1 className="text-4xl font-bold">Welcome to the Legal AI App!</h1>
                <p className="text-lg text-center">
                    Get started by choosing a country and searching with keywords to find legal information.
                </p>
                <div className="w-2/3 px-5">
                    <SearchBar placeholder="Type your keywords here ..." onSearch={handleSearch}/>
                </div>
                <div className="w-96 px-5">
                    <label className="block text-sm font-medium mb-2">
                        Select a country
                    </label>
                    <CountrySelector
                        id={"country-selector"}
                        open={isOpen}
                        onToggle={() => setIsOpen(!isOpen)}
                        onChange={setCountry}
                        selectedValue={COUNTRIES.find((option) => option.value === country)}
                    />
                </div>
            </div>
        </div>
    );
}







