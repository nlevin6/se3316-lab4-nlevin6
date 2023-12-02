import React, { useState, useEffect } from 'react';

const EditList = ({ listId, initialListName, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [editedListName, setEditedListName] = useState('');
    const [visibility, setVisibility] = useState('');
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [heroesCollection, setHeroesCollection] = useState([]);
    const [modifiedAt, setModifiedAt] = useState('');

    const minLength = 0;

    useEffect(() => {
        const fetchListDetails = async () => {
            try {
                if (listId.trim() !== '' && listId.length >= minLength) {
                    const response = await fetch(`/superhero-lists/${listId}`);

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    const listDetails = data.list;

                    setName(listDetails.name);
                    setDescription(listDetails.description);
                    setVisibility(listDetails.visibility);
                    setHeroesCollection(listDetails.superheroes || []);
                    setModifiedAt(listDetails.modifiedAt);

                    if (initialListName) {
                        setEditedListName(initialListName);
                    }
                }
            } catch (error) {
                console.error('Error fetching list details:', error);
            }
        };

        fetchListDetails();
    }, [listId, initialListName, minLength]);


    const handleSearch = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`/superhero-search?query=${query}`);
            if (response.ok) {
                const data = await response.json();
                setSearchResults(data);
            } else {
                console.error('Error searching for heroes:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error searching for heroes:', error);
        }
    };

    const handleAddToMyList = (selectedHero) => {
        const heroIndex = heroesCollection.findIndex(hero => hero.name === selectedHero.name);

        if (heroIndex === -1) {
            setHeroesCollection(prevHeroes => [...prevHeroes, selectedHero]);
        } else {
            const updatedHeroes = [...heroesCollection];
            updatedHeroes.splice(heroIndex, 1);
            setHeroesCollection(updatedHeroes);
        }
    };

    const setEditedListNameWithSanitization = (input) => {
        const sanitizedInput = input.replace(/[^a-zA-Z\s]/g, '');
        setEditedListName(sanitizedInput);
    };

    const handleSave = async () => {
        try {
            if (editedListName.trim() === '') {
                console.error('List name is empty');
                return;
            }

            const response = await fetch(`/superhero-lists/${listId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: editedListName,
                    description,
                    visibility,
                    superheroes: heroesCollection,
                }),
            });

            if (response.ok) {
                onSave();
                onClose();
            } else {
                console.error('Error updating list:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error updating list:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-opacity-50 bg-black">
            <div className="bg-white w-full max-w-md p-6 rounded-md shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Edit Your List</h2>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Last Modified at:
                    </label>
                    <p>{modifiedAt ? new Date(modifiedAt).toLocaleString() : 'N/A'}</p>
                </div>

                <form onSubmit={handleSearch}>
                    {/* List Name */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            List Name:
                        </label>
                        <input
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 ${editedListName.length < minLength ? 'border-red-500' : ''}`}
                            type="text"
                            value={editedListName}
                            onChange={(e) => setEditedListNameWithSanitization(e.target.value)}
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Description:
                        </label>
                        <textarea
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Visibility */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Visibility:
                        </label>
                        <select
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value)}
                        >
                            <option value="private">Private</option>
                            <option value="public">Public</option>
                        </select>
                    </div>

                    {/* Search Heroes */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Search Heroes:
                        </label>
                        <div className="flex">
                            <input
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded-md ml-2"
                                type="submit"
                            >
                                Search
                            </button>
                        </div>
                        {searchResults.length > 0 && (
                            <div className="mt-2">
                                <p className="text-sm font-semibold mb-1">Search Results:</p>
                                <ul className="list-disc pl-4">
                                    {searchResults.map((hero) => (
                                        <li key={hero.id} className="flex justify-between items-center">
                                            <div>
                                                {hero.name} - {hero.Publisher}
                                            </div>
                                            <button
                                                className={`ml-2 ${heroesCollection.find(h => h.name === hero.name) ? 'bg-red-500' : 'bg-green-500'} text-white py-1 px-2 rounded-md`}
                                                onClick={() => handleAddToMyList(hero)}
                                            >
                                                {heroesCollection.find(h => h.name === hero.name) ? 'Remove from List' : 'Add to List'}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </form>
                <div className="flex justify-end mt-4">
                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
                        type="button"
                        onClick={handleSave}
                    >
                        Update List
                    </button>
                    <button
                        className="ml-2 text-gray-600 hover:text-gray-800"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditList;
