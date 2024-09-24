'use client'

import React, { useState } from 'react'
import { SearchBar } from '@/features/google-search/components/search-bar'
import { SearchResultsList } from '@/features/google-search/components/search-results'
import { AdvancedSearchOptions } from '@/features/google-search/components/advanced-search-options'
import { SidebarSelectedDocuments } from '@/features/google-search/components/sidebar-selected-documents'
import { useSelectedItemsStore } from '@/stores/selectedItemsStore'
import { CountryShortName } from '@/lib/types' // Ensure this type is imported

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
    <div className="flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
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
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col min-h-full p-6">
          <div className="grow flex flex-col items-center justify-center space-y-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold">Welcome to the Legal AI App!</h1>
            <p className="text-lg text-center">
              Get started by choosing a country and searching with keywords to
              find legal information.
            </p>
            <div className="w-full max-w-md">
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
            </div>
          </div>
          <div className="w-full max-w-4xl mx-auto mt-8">
            <SearchResultsList
              results={searchResults}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
          </div>
        </div>
      </div>
      <SidebarSelectedDocuments userId={userId} />
    </div>
  )
}