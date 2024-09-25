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
    <div className={`w-full max-w-md space-y-6 ${className}`}>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="country-specific-search"
            checked={countrySpecificSearch}
            onCheckedChange={(checked) => setCountrySpecificSearch(checked as boolean)}
          />
          <Label htmlFor="country-specific-search">Country specific search</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="country-selector">Select a country</Label>
        <CountrySelector
          id="country-selector"
          open={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
          onChange={setCountry}
          selectedValue={selectedCountry}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="search-type">Search type</Label>
        <Select value={searchType} onValueChange={(value) => setSearchType(value as "strict" | "medium" | "open")}>
          <SelectTrigger id="search-type">
            <SelectValue placeholder="Select search type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="strict">Strict</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="open">Open</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="file-type">File type</Label>
        <Select value={fileType || 'any'} onValueChange={(value) => setFileType(value === 'any' ? undefined : value as "pdf" | "docx")}>
          <SelectTrigger id="file-type">
            <SelectValue placeholder="Select file type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="docx">DOCX</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="results">Number of search results</Label>
        <Slider
          id="results"
          min={1}
          max={16}
          step={1}
          value={[results]}
          onValueChange={(value) => setResults(value[0])}
        />
        <div className="text-sm text-muted-foreground text-center">{results}</div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="before">Before year</Label>
        <Input
          id="before"
          type="number"
          value={before || ''}
          onChange={(e) => setBefore(e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="after">After year</Label>
        <Input
          id="after"
          type="number"
          value={after || ''}
          onChange={(e) => setAfter(e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="site">Site specific search</Label>
        <Input
          id="site"
          type="text"
          value={site || ''}
          onChange={(e) => setSite(e.target.value || undefined)}
        />
      </div>
    </div>
  )
}