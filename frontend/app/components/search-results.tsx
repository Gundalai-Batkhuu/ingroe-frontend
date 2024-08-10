import React, { useState } from "react";

export interface SearchResult {
  title: string;
  link: string;
  html_snippet: string;
  snippet: string;
  thumbnail: string;
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength - 1) + "…";
};

export const SearchResultsList = ({ results }: { results: SearchResult[] }) => {
  const [selectedItems, setSelectedItems] = useState<SearchResult[]>([]);

  const toggleItemSelection = (result: SearchResult) => {
    setSelectedItems(prev =>
      prev.includes(result) ? prev.filter(item => item !== result) : [...prev, result]
    );
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      {results.map((result, index) => (
        <div key={index} className="mb-12 flex items-center justify-between">
          <div className="flex-grow pr-4">
            <div className="flex items-center mb-1">
              {result.thumbnail && (
                <img src={result.thumbnail} alt="" className="w-8 h-8 mr-2 rounded-full" />
              )}
              <div className="overflow-hidden">
                <a
                  href={result.link}
                  className="text-sm text-gray-300 hover:underline block whitespace-nowrap overflow-hidden text-overflow-ellipsis"
                  title={result.link}
                >
                  {truncateText(result.link, 80)}
                </a>
              </div>
            </div>
            <h3 className="text-xl mb-1">
              <a href={result.link} className="text-blue-500 hover:underline">{result.title}</a>
            </h3>
            <p className="text-sm text-gray-200" dangerouslySetInnerHTML={{ __html: result.html_snippet || result.snippet }} />
          </div>
          <div className="flex-shrink-0">
            <input
              type="checkbox"
              className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              checked={selectedItems.includes(result)}
              onChange={() => toggleItemSelection(result)}
            />
          </div>
        </div>
      ))}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 shadow-md">
          <p className="text-center text-white">
            {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsList;