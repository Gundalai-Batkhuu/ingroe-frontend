import React from 'react'
import { cn } from "@/lib/utils"
import { SearchOptions, SearchOptionsProps } from '@/features/google-search/components/search-options'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { ChevronDownIcon } from "@/components/icons"

export function AdvancedSearchOptions({
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
  className,
  userId
}: SearchOptionsProps) {
  return (
    <div className={cn("w-full", className)}>
      <Accordion type="single" collapsible>
        <AccordionItem value="advanced-search">
          <AccordionTrigger className="flex items-center justify-between w-full">
            <span>Advanced Search</span>
            <ChevronDownIcon className="h-4 w-4" />
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-6">
              <SearchOptions
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
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
