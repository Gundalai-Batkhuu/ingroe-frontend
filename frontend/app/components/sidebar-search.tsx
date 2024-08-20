import React from 'react'
import CountrySelector from "@/app/components/country-selector";
import {COUNTRIES, Country} from "@/app/lib/countries";
import {ThemeToggle} from "@/app/components/theme-toggle";
import {useSidebar} from "@/app/lib/hooks/use-sidebar";
import {cn} from "@/app/lib/utils";

export interface SidebarProps extends React.ComponentProps<'div'> {
    country: string;
    setCountry: (country: string) => void;
    countrySpecificSearch: boolean;
    setCountrySpecificSearch: (value: boolean) => void;
    searchType: "strict" | "medium" | "open";
    setSearchType: (value: "strict" | "medium" | "open") => void;
    fileType: string | null;
    setFileType: (value: string | null) => void;
    results: number;
    setResults: (value: number) => void;
    before: number | null;
    setBefore: (value: number | null) => void;
    after: number | null;
    setAfter: (value: number | null) => void;
    site: string | null;
    setSite: (value: string | null) => void;
}

export function SidebarSearch({
                                  country, setCountry,
                                  countrySpecificSearch, setCountrySpecificSearch,
                                  searchType, setSearchType,
                                  fileType, setFileType,
                                  results, setResults,
                                  before, setBefore,
                                  after, setAfter,
                                  site, setSite, className
                              }: SidebarProps) {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const selectedCountry = COUNTRIES.find((option: Country) => option.value === country) || COUNTRIES[0];
    const {isSidebarOpen, isLoading} = useSidebar()

    return (
        <div
            className={cn(
                className,
                'h-full flex-col dark:bg-zinc-950',
                isSidebarOpen && !isLoading ? 'translate-x-0' : '-translate-x-full',
                'transition-transform duration-300 ease-in-out'
            )}
        >
            <div
                className="flex flex-col h-full inset-y-0 border-r lg:w-[250px] xl:w-[300px] bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl overflow-hidden">
                <div className="w-full h-full overflow-y-auto">
                    <div className="w-full max-w-md p-4 space-y-5">
                        <div className="mb-10 mt-4">
                            <label className="block text-xs font-medium mb-1" htmlFor="country-selector">
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

                        <div className="mb-10">
                            <label className="block text-xs font-medium mb-1">
                                Country Specific Search
                            </label>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={countrySpecificSearch}
                                    onChange={(e) => setCountrySpecificSearch(e.target.checked)}
                                    className="form-checkbox size-4 text-primary border-input"
                                />
                            </div>
                        </div>

                        <div className="mb-10">
                            <label className="block text-xs font-medium mb-1" htmlFor="search-type">
                                Search Type
                            </label>
                            <select
                                id="search-type"
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value as "strict" | "medium" | "open")}
                                className="w-full bg-background text-foreground border border-input rounded-md shadow-sm pl-2 pr-8 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            >
                                <option value="strict">Strict</option>
                                <option value="medium">Medium</option>
                                <option value="open">Open</option>
                            </select>
                        </div>

                        <div className="mb-10">
                            <label className="block text-xs font-medium mb-1" htmlFor="file-type">
                                File Type
                            </label>
                            <input
                                id="file-type"
                                type="text"
                                value={fileType || ''}
                                onChange={(e) => setFileType(e.target.value || null)}
                                className="w-full bg-background text-foreground border border-input rounded-md shadow-sm px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            />
                        </div>

                        <div className="mb-10">
                            <label className="block text-xs font-medium mb-1" htmlFor="results">
                                Results
                            </label>
                            <input
                                id="results"
                                type="number"
                                value={results}
                                onChange={(e) => setResults(Number(e.target.value))}
                                min={1}
                                max={16}
                                className="w-full bg-background text-foreground border border-input rounded-md shadow-sm px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            />
                        </div>

                        <div className="mb-10">
                            <label className="block text-xs font-medium mb-1" htmlFor="before">
                                Before
                            </label>
                            <input
                                id="before"
                                type="number"
                                value={before || ''}
                                onChange={(e) => setBefore(e.target.value ? Number(e.target.value) : null)}
                                className="w-full bg-background text-foreground border border-input rounded-md shadow-sm px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            />
                        </div>

                        <div className="mb-10">
                            <label className="block text-xs font-medium mb-1" htmlFor="after">
                                After
                            </label>
                            <input
                                id="after"
                                type="number"
                                value={after || ''}
                                onChange={(e) => setAfter(e.target.value ? Number(e.target.value) : null)}
                                className="w-full bg-background text-foreground border border-input rounded-md shadow-sm px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            />
                        </div>

                        <div className="mb-10">
                            <label className="block text-xs font-medium mb-1" htmlFor="site">
                                Site
                            </label>
                            <input
                                id="site"
                                type="text"
                                value={site || ''}
                                onChange={(e) => setSite(e.target.value || null)}
                                className="w-full bg-background text-foreground border border-input rounded-md shadow-sm px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            />
                        </div>
                    </div>
                </div>
                <div className="p-4">
                    <ThemeToggle/>
                </div>
            </div>
        </div>
    )
}