import React from 'react';

const SearchResults = ({ results }) => {
    return (
        <div>
            <h2>Search Results</h2>
            {results.length === 0 ? (
                <p>No matching superheroes found.</p>
            ) : (
                <ul>
                    {results.map((superhero) => (
                        <li key={superhero.id}>{superhero.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchResults;
