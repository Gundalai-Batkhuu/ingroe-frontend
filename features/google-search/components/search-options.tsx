import React from 'react'
import { COUNTRIES, Country } from '@/data/countries'
import { CountryShortName } from '@/lib/types'
import CountrySelector from '@/features/google-search/components/country-selector'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"

export interface SearchOptionsProps extends React.ComponentProps<'div'> {
  country: CountryShortName;
  setCountry: (country: CountryShortName) => void;
  countrySpecificSearch: boolean;
  setCountrySpecificSearch: (value: boolean) => void;
  searchType: "strict" | "medium" | "open";
  setSearchType: (value: "strict" | "medium" | "open") => void;
  fileType: "pdf" | "docx" | undefined;
  setFileType: (value: "pdf" | "docx" | undefined) => void;
  results: number;
  setResults: (value: number) => void;
  before: number | undefined;
  setBefore: (value: number | undefined) => void;
  after: number | undefined;
  setAfter: (value: number | undefined) => void;
  site: string | undefined;
  setSite: (value: string | undefined) => void;
  userId: string;
}

export function SearchOptions({
  country,
  setCountry,
  countrySpecificSearch,
  setCountrySpecificSearch,
  searchType,
  setSearchType,
  fileType,
  setFileType,
  results,
  setResults,
  before,
  setBefore,
  after,
  setAfter,
  site,
  setSite,
  className
}: SearchOptionsProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const selectedCountry = COUNTRIES.find((option: Country) => option.value === country) || COUNTRIES[0]

  return (
    <div className={`w-full space-y-4 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <h3 className="text-sm font-semibold mb-2">Search Settings</h3>
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs">
              <Checkbox
                id="country-specific-search"
                checked={countrySpecificSearch}
                onCheckedChange={(checked) => setCountrySpecificSearch(checked as boolean)}
              />
              Country specific search
            </Label>
          </div>
          <div className="mt-2">
            <Label htmlFor="country-selector" className="text-xs">Select a country</Label>
            <CountrySelector
              id="country-selector"
              open={isOpen}
              onToggle={() => setIsOpen(!isOpen)}
              onChange={setCountry}
              selectedValue={selectedCountry}
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">Search Type</h3>
          <Select value={searchType} onValueChange={(value) => setSearchType(value as "strict" | "medium" | "open")}>
            <SelectTrigger id="search-type" className="text-xs">
              <SelectValue placeholder="Select search type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="strict" className="text-xs">Strict</SelectItem>
              <SelectItem value="medium" className="text-xs">Medium</SelectItem>
              <SelectItem value="open" className="text-xs">Open</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">File Type</h3>
          <Select value={fileType || 'any'} onValueChange={(value) => setFileType(value === 'any' ? undefined : value as "pdf" | "docx")}>
            <SelectTrigger id="file-type" className="text-xs">
              <SelectValue placeholder="Select file type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any" className="text-xs">Any</SelectItem>
              <SelectItem value="pdf" className="text-xs">PDF</SelectItem>
              <SelectItem value="docx" className="text-xs">DOCX</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">Number of search results</h3>
        <Slider
          id="results"
          min={1}
          max={16}
          step={1}
          value={[results]}
          onValueChange={(value) => setResults(value[0])}
        />
        <div className="text-xs text-muted-foreground text-center mt-1">{results}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-semibold mb-2">Date Range</h3>
          <div className="space-y-2">
            <div>
              <Label htmlFor="before" className="text-xs">Before year</Label>
              <Input
                id="before"
                type="number"
                value={before || ''}
                onChange={(e) => setBefore(e.target.value ? Number(e.target.value) : undefined)}
                className="text-xs"
              />
            </div>
            <div>
              <Label htmlFor="after" className="text-xs">After year</Label>
              <Input
                id="after"
                type="number"
                value={after || ''}
                onChange={(e) => setAfter(e.target.value ? Number(e.target.value) : undefined)}
                className="text-xs"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">Site Specific Search</h3>
          <Label htmlFor="site" className="text-xs">Enter website URL</Label>
          <Input
            id="site"
            type="text"
            value={site || ''}
            onChange={(e) => setSite(e.target.value || undefined)}
            placeholder="e.g., example.com"
            className="text-xs"
          />
        </div>
      </div>
    </div>
  )
}
