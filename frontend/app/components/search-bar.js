import React, { useState, useRef } from 'react';

const SearchBar = ({ placeholder = "Search...", onSearch }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex">
      <div className="relative flex-grow">
        <input
          ref={inputRef}
          type="text"
          className="
            w-full sm:text-sm bg-background text-foreground
            border border-input rounded-l-md shadow-sm
            pl-3 pr-10 py-2
            focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary
          "
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      <button
        type="submit"
        className="
          bg-primary text-primary-foreground hover:bg-primary/90
          px-4 py-2 rounded-r-md shadow-sm
          focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1
          transition duration-150 ease-in-out
        "
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;