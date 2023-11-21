import React, {useState} from 'react';
import SearchForm from '../src/components/SearchForm.js';
import SearchResults from '../src/components/SearchResults.js';

const App = () => {
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async (searchParams) => {
        try {
            const response = await fetch(`/superhero/search?${new URLSearchParams(searchParams)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setSearchResults(data.matchingSuperheroes || []);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    return (
        <div>
            <SearchForm onSearch={handleSearch}/>
            <SearchResults results={searchResults}/>
        </div>
    );
};

export default App;
