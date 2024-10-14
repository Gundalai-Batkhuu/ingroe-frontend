'use client'

import React, { useState } from 'react'
import { SearchBar } from '@/features/google-search/components/search-bar'
import { SearchResultsList } from '@/features/google-search/components/search-results'
import { AdvancedSearchOptions } from '@/features/google-search/components/advanced-search-options'
import { useSelectedItemsStore } from '@/stores/selectedItemsStore'
import { CountryShortName } from '@/lib/types'

interface SearchPageContentProps {
  userId: string
}

export default function SearchPageContent({ userId }: SearchPageContentProps) {
  const [searchResults, setSearchResults] = useState([])
  const [country, setCountry] = useState<CountryShortName>('AU')
  const [countrySpecificSearch, setCountrySpecificSearch] = useState(true)
  const [searchType, setSearchType] = useState<'strict' | 'medium' | 'open'>('medium')
  const [fileType, setFileType] = useState<'pdf' | 'docx' | undefined>(undefined)
  const [results, setResults] = useState(10)
  const [before, setBefore] = useState<number | undefined>(undefined)
  const [after, setAfter] = useState<number | undefined>(undefined)
  const [site, setSite] = useState<string | undefined>(undefined)
  const { selectedItems, setSelectedItems } = useSelectedItemsStore()

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] overflow-y-auto pt-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl mx-auto space-y-6">
        <AdvancedSearchOptions
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
        <SearchBar
          setResults={setSearchResults}
          country={country}
          countrySpecificSearch={countrySpecificSearch}
          searchType={searchType}
          fileType={fileType}
          results={results}
          before={before}
          after={after}
          site={site}
        />
        <SearchResultsList
          results={searchResults}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      </div>
    </div>
  )
}
