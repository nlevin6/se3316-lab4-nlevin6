import React, { useState } from 'react';

const SearchResults = ({ results }) => {
    const [expandedHero, setExpandedHero] = useState(null);

    const handleExpand = async (superhero) => {
        try {
            const response = await fetch(`http://localhost:3000/superhero/${superhero.id}/powers`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log("Backend response:", data);  // Log the entire data object
            superhero.powers = data || [];
            setExpandedHero(superhero.id === expandedHero ? null : superhero.id);
        } catch (error) {
            console.error('Error fetching superhero powers:', error);

            // Handle the error by setting powers to an empty array
            superhero.powers = [];
            setExpandedHero(superhero.id === expandedHero ? null : superhero.id);
        }
    };

    const handleSearchOnDDG = (heroName) => {
        const searchQuery = `https://duckduckgo.com/?q=${encodeURIComponent(heroName + ' superhero')}&n=10`;

        window.open(searchQuery, '_blank');
    };

    //change this based on how many results should be displayed to the user. free users can only see 10 results
    const displayedResults = results.slice(0, 10);

    return (
        <div className="container mx-auto my-8">
            <h2 className="text-3xl font-bold mb-6">Search Results</h2>
            {displayedResults && Array.isArray(displayedResults) && displayedResults.length > 0 ? (
                <ul className="space-y-4">
                    {displayedResults.map((superhero) => (
                        <li key={superhero.id} className="border p-4 rounded-md">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold">{superhero.name} - {superhero.Publisher}</span>
                                <div className="flex space-x-2">
                                    <button
                                        className="bg-blue-500 text-white py-1 px-2 rounded"
                                        onClick={() => handleExpand(superhero)}
                                    >
                                        {expandedHero === superhero.id ? 'Collapse' : 'Expand'}
                                    </button>
                                    <button
                                        className="bg-yellow-500 text-white py-1 px-2 rounded"
                                        onClick={() => handleSearchOnDDG(superhero.name)}
                                    >
                                        Search on DDG
                                    </button>
                                </div>
                            </div>
                            {expandedHero === superhero.id && (
                                <div className="mt-4 border p-4 rounded-md bg-gray-200">
                                    <div className="mt-4 border p-4 rounded-md bg-blue-200">
                                        <p><span className="font-semibold">Gender:</span> {superhero.Gender}</p>
                                        <p><span className="font-semibold">Eye color:</span> {superhero['Eye color']}
                                        </p>
                                        <p><span className="font-semibold">Race:</span> {superhero.Race}</p>
                                        <p><span className="font-semibold">Hair color:</span> {superhero['Hair color']}
                                        </p>
                                        <p><span className="font-semibold">Height:</span> {superhero.Height}</p>
                                        <p><span className="font-semibold">Skin color:</span> {superhero['Skin color']}
                                        </p>
                                        <p><span className="font-semibold">Alignment:</span> {superhero.Alignment}</p>
                                        <p><span className="font-semibold">Weight:</span> {superhero.Weight}</p>
                                    </div>
                                    <div className="mt-4 border p-4 rounded-md bg-green-200">
                                        <h3 className="text-lg font-semibold mb-2">Superpowers</h3>
                                        <ul className="list-disc pl-6">
                                            {Object.entries(superhero.powers).map(([power, value]) => (
                                                value === "True" && <li key={power}>{power}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-lg">No matching superheroes found.</p>
            )}
        </div>
    );
};

export default SearchResults;
