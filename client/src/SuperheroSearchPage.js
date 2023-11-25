import React, {useState} from 'react';
import SearchForm from "./components/SearchForm";
import SearchResults from "./components/SearchResults";

const SuperheroSearchPage = () => {
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async (searchParams) => {
        console.log("search params: ", searchParams);
        try {
            const response = await fetch(`http://localhost:3000/superhero/search?${new URLSearchParams(searchParams)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Search results: ', data);
            setSearchResults(data.matchingSuperheroes || []);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Superhero Search</h1>
            <SearchForm onSearch={handleSearch}/>
            <SearchResults results={searchResults}/>
        </div>
    );
};

export default SuperheroSearchPage;
