import React from 'react';

const SearchResults = ({ results }) => {
    return (
        <div className="mt-6">
            <h2 className="text-2xl font-bold mb-2">Search Results</h2>
            {results && Array.isArray(results) && results.length > 0 ? (
                <ul className="list-disc pl-6">
                    {results.map((superhero) => (
                        <li key={superhero.id} className="mb-2">
                            <span className="font-bold">{superhero.name}</span> - {superhero.publisher}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-600">No matching superheroes found.</p>
            )}
        </div>
    );
};

export default SearchResults;
