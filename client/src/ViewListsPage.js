import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import EditList from './components/EditList';

const ViewListsPage = () => {
    const [lists, setLists] = useState([]);
    const [editList, setEditList] = useState(null);
    const authInstance = getAuth();
    const user = authInstance.currentUser;

    const fetchSuperheroLists = async () => {
        try {
            const response = await fetch('/superhero-lists');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setLists(data.lists || []);
        } catch (error) {
            console.error('Error fetching superhero lists:', error);
        }
    };


    useEffect(() => {
        // Fetch superhero lists when the component mounts
        fetchSuperheroLists();
    }, []);

    const handleDeleteList = async (listId) => {
        try {
            console.log('Deleting list:', listId);

            const response = await fetch(`/superhero-lists/${listId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setLists((prevLists) => prevLists.filter((list) => list.name !== listId));
            } else {
                console.error('Error deleting list:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error deleting list:', error);
        }
    };

    const handleGoBack = () => {
        window.history.back();
    };

    const handleEditList = async (listId) => {
        if (listId) {
            try {
                const response = await fetch(`/superhero-lists/${listId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setEditList(data.list);
            } catch (error) {
                console.error('Error fetching list details:', error);
            }
        } else {
            console.error('List ID is null or undefined');
        }
    };



    const handleSaveEdit = () => {
        setEditList(null);
        fetchSuperheroLists();
    };

    const handleCloseEdit = () => {
        setEditList(null);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Lists</h1>
            <button className="bg-blue-500 text-white py-2 px-4 rounded mb-2" onClick={handleGoBack}>
                Back
            </button>
            {lists.map((list) => (
                (list.visibility === 'public' || user) && (
                    <div key={list.name} className="mb-4">
                        <h2 className="text-xl font-semibold mb-2">{list.name}</h2>
                        <p>{list.description}</p>
                        {list.superheroes && list.superheroes.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mt-2">Heroes:</h3>
                                <ul>
                                    {list.superheroes.map((hero, index) => (
                                        <li key={index}>{hero.name} - {hero.Publisher}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {user && (
                            <div>
                                <button
                                    className="bg-red-500 text-white py-2 px-4 rounded mr-2 cursor-pointer"
                                    onClick={() => handleDeleteList(list.name)}
                                >
                                    Delete
                                </button>
                                <button
                                    className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer"
                                    onClick={() => handleEditList(list.id)}
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>
                )
            ))}

            {editList && (
                <EditList
                    listId={editList.id}
                    initialListName={editList.name}
                    onClose={handleCloseEdit}
                    onSave={handleSaveEdit}
                />
            )}
        </div>
    );
};

export default ViewListsPage;
