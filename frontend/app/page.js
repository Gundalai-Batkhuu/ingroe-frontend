'use client'

import React, {useState} from "react";
import CountrySelector from "@/app/components/country-selector";
import {COUNTRIES} from "@/app/lib/countries";

export default function Home() {
    const [isOpen, setIsOpen] = useState(false);
    // Default this to a country's code to preselect it
    const [country, setCountry] = useState("AU");


    return (
        <div className="flex flex-col items-center justify-between p-24">
            <div className="flex flex-col items-center justify-center space-y-8">
                <h1 className="text-4xl font-bold">Welcome to the Legal AI App!</h1>
                <p className="text-lg text-center">
                    Get started by choosing a country to view its legal information.
                </p>
                <div className="w-96 px-5">
                    <label className="block text-sm font-medium">
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
