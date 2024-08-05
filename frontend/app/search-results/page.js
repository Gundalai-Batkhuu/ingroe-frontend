'use client'

import React, { useState } from "react";
import SearchBar from "@/app/components/search-bar";

// Mock data for search results
const mockResults = [
  { id: 1, title: "Legal Rights and Responsibilities", snippet: "An overview of basic legal rights and responsibilities in various contexts..." },
  { id: 2, title: "Understanding Contract Law", snippet: "Explore the fundamentals of contract law, including formation, terms, and enforcement..." },
  { id: 3, title: "Criminal Law Basics", snippet: "Learn about the core concepts of criminal law, including types of crimes and defenses..." },
  { id: 4, title: "Introduction to Intellectual Property", snippet: "Discover the different types of intellectual property protection: patents, copyrights, and trademarks..." },
  { id: 5, title: "Employment Law Guide", snippet: "A comprehensive guide to employment law, covering hiring, discrimination, and termination..." },
];

const ContentItem = ({ item, isSelected, onToggle }) => {
  return (
    <div
      className={`p-4 border rounded-lg mb-4 cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-100 border-blue-500' : 'bg-white hover:bg-gray-50'
      }`}
      onClick={() => onToggle(item.id)}
    >
      <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
      <p className="text-gray-600">{item.snippet}</p>
    </div>
  );
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSearch = (query) => {
    console.log('Searching for:', query);
    setSearchQuery(query);
    // In a real application, you would fetch search results here
  };

  const toggleItemSelection = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchBar placeholder="Search legal information..." onSearch={handleSearch}/>
        </div>

        {searchQuery && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing results for: <span className="font-semibold">{searchQuery}</span>
            </p>
          </div>
        )}

        <div className="space-y-4">
          {mockResults.map(result => (
            <ContentItem
              key={result.id}
              item={result}
              isSelected={selectedItems.includes(result.id)}
              onToggle={toggleItemSelection}
            />
          ))}
        </div>

        {selectedItems.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-md">
            <p className="text-center">
              {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
            </p>
          </div>
        )}
      </div>
    </div>
  );
}