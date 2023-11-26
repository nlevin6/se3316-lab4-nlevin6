import React, {useState} from 'react';
import SearchForm from "./components/SearchForm";
import SearchResults from "./components/SearchResults";
import CreateList from "./components/CreateList";

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

            if (data.matchingSuperheroes && data.matchingSuperheroes.length > 0) {
                setSearchResults(data.matchingSuperheroes);
            } else {
                // no results found
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);

            // set state to indicate no results due to network error
            setSearchResults([]);
        }
    };

    //redirect to the login page
    const handleLogout = () => {
        window.location.href = '/login';
    };

    return (
        <div>
            <button className="bg-red-500 text-white py-2 px-4 rounded mb-2 absolute top-4 right-4"
                    onClick={handleLogout}>
                Logout
            </button>
            <h1 className="text-3xl font-bold mb-6">Superhero Codex</h1>
            <CreateList/>
            <SearchForm onSearch={handleSearch}/>
            <SearchResults results={searchResults}/>
        </div>
    );
};

export default SuperheroSearchPage;
