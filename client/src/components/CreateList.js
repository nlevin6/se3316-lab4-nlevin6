import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, getIdTokenResult } from 'firebase/auth';

const CreateList = ({ onClose }) => {
    const [user, setUser] = useState(null);
    const [listName, setListName] = useState('');
    const [description, setDescription] = useState('');
    const [heroesCollection, setHeroesCollection] = useState([]);
    const [visibility, setVisibility] = useState('private');
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const authInstance = getAuth();

        const unsubscribe = onAuthStateChanged(authInstance, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const setListNameWithSanitization = (input) => {
        const sanitizedInput = input.replace(/[^a-zA-Z\s]/g, '');
        setListName(sanitizedInput);
    };

    const handleCreateList = async () => {
        if (!listName) {
            alert('Please enter a list name.');
            return;
        }

        if (!user) {
            console.log('User is not authenticated. Unable to create a list.');
            return;
        }

        try {
            const authInstance = getAuth();
            const user = authInstance.currentUser;

            if (!user) {
                console.log('User is not authenticated. Unable to create a list.');
                return;
            }

            const tokenResult = await getIdTokenResult(user);
            const token = tokenResult.token;

            console.log('Authenticated User. Token:', token);
            console.log({ listName, description, heroesCollection, visibility });

            const createListResponse = await fetch('/superhero-lists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    listName,
                    description,
                    superheroes: heroesCollection,
                    visibility,
                }),
            });

            if (createListResponse.ok) {
                const listData = await createListResponse.json();
                const newListId = listData.listId;

                console.log('List created successfully. ID:', newListId);
            } else {
                console.error('Error creating list:', createListResponse.status, createListResponse.statusText);
                alert('Error creating list.');
            }
        } catch (error) {
            console.error('Error getting user token:', error);
        }

        onClose();
    };

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
            // Hero not in the list, add it
            setHeroesCollection(prevHeroes => [...prevHeroes, selectedHero]);
        } else {
            // Hero is in the list, remove it
            const updatedHeroes = [...heroesCollection];
            updatedHeroes.splice(heroIndex, 1);
            setHeroesCollection(updatedHeroes);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-opacity-50 bg-black">
            <div className="bg-white w-full max-w-md p-6 rounded-md shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Create a New List</h2>

                <form onSubmit={handleSearch}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            List Name:
                        </label>
                        <input
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            type="text"
                            value={listName}
                            onChange={(e) => setListNameWithSanitization(e.target.value)}
                        />
                    </div>
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
                        onClick={handleCreateList}
                    >
                        Create List
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

export default CreateList;
