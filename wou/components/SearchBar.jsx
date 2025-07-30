// SearchBar.jsx
import React, { useState } from 'react';

function SearchBar({ setSearchQuery }) {
  const [input, setInput] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(input.trim().toLowerCase());
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center space-x-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search by destination..."
        className="w-full px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;
