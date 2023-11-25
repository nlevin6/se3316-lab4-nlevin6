import React from 'react';

const SearchResults = ({ results }) => {
    return (
        <div>
            <h2>Search Results</h2>
            {results && Array.isArray(results) && results.length > 0 ? (
                <ul>
                    {results.map((superhero) => (
                        <li key={superhero.id}>{superhero.name}</li>
                    ))}
                </ul>
            ) : (
                <p>No matching superheroes found.</p>
            )}
        </div>
    );
};

export default SearchResults;
