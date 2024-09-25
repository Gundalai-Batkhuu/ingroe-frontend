import React from 'react'
import { cn } from "@/lib/utils"
import { SearchOptions, SearchOptionsProps } from '@/features/google-search/components/search-options'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
    <Card className={cn(
      "h-full w-full lg:w-[250px] xl:w-[300px]",
      "border-r dark:bg-zinc-950/50",
      "backdrop-blur-xl",
      className
    )}>
      <CardHeader className="p-4 lg:p-6">
        <CardTitle className="text-lg">Advanced Search</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-120px)] lg:h-[calc(100vh-140px)]">
          <div className="p-4 lg:p-6">
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
        </ScrollArea>
      </CardContent>
    </Card>
  )
}