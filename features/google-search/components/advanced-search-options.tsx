import React from 'react'
import {cn} from "@/lib/utils";
import { SearchOptions, SearchOptionsProps } from '@/features/google-search/components/search-options'

export function AdvancedSearchOptions({
                                  country, setCountry,
                                  countrySpecificSearch, setCountrySpecificSearch,
                                  searchType, setSearchType,
                                  fileType, setFileType,
                                  results, setResults,
                                  before, setBefore,
                                  after, setAfter,
                                  site, setSite, className, userId
                              }: SearchOptionsProps) {

    return (
      <div
        className={cn(
          className,
          'h-full flex-col dark:bg-zinc-950'
        )}
      >
        <div className="flex flex-col h-full inset-y-0 border-r lg:w-[250px] xl:w-[300px] bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl overflow-hidden">
          <div className="size-full overflow-y-auto">
            <SearchOptions
              country={country} setCountry={setCountry}
              countrySpecificSearch={countrySpecificSearch} setCountrySpecificSearch={setCountrySpecificSearch}
              searchType={searchType} setSearchType={setSearchType}
              fileType={fileType} setFileType={setFileType}
              results={results} setResults={setResults}
              before={before} setBefore={setBefore}
              after={after} setAfter={setAfter}
              site={site} setSite={setSite} userId={userId}
            />
          </div>
        </div>
      </div>
    )
}