import React from 'react';
import SearchForm from "./components/SearchForm";
import SearchResults from "./components/SearchResults";

const SuperheroSearchPage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Superhero Search</h1>
            <SearchForm />
        </div>
    );
};

export default SuperheroSearchPage;
