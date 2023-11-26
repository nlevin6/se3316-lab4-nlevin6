import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, getIdTokenResult } from 'firebase/auth';

const CreateList = () => {
    const [user, setUser] = useState(null);
    const [listName, setListName] = useState('');
    const [description, setDescription] = useState('');
    const [heroesCollection, setHeroesCollection] = useState('');
    const [visibility, setVisibility] = useState('private');

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
            const tokenResult = await getIdTokenResult(authInstance.currentUser);
            const token = tokenResult.token;

            console.log('Authenticated User. Token:', token);
            console.log({ listName, description, heroesCollection, visibility });

            const response = await fetch('http://localhost:3000/superhero-lists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    listName,
                    description,
                    heroesCollection,
                    visibility,
                }),
            });

            if (response.ok) {
                console.log('List created successfully.');
                //Handle success
            } else {
                console.error('Error creating list:', response.status, response.statusText);
                //Handle error
            }
        } catch (error) {
            console.error('Error getting user token:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Create a New List</h2>
            <form>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        List Name:
                    </label>
                    <input
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                        type="text"
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
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
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
                    type="button"
                    onClick={handleCreateList}
                >
                    Create List
                </button>
            </form>
        </div>
    );
};

export default CreateList;
