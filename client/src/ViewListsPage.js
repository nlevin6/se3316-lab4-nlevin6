import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import EditList from './components/EditList';

const ViewListsPage = () => {
    const [lists, setLists] = useState([]);
    const [editList, setEditList] = useState(null);
    const authInstance = getAuth();
    const user = authInstance.currentUser;

    const fetchListById = async (listId) => {
        try {
            const response = await fetch(`/superhero-lists/${listId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data.list;
        } catch (error) {
            console.error('Error fetching list by ID:', error);
            return null;
        }
    };



    useEffect(() => {
        if (editList && editList.id) {
            fetchListById(editList.id)
                .then(listData => {
                    if (listData) {
                        setEditList(listData);
                    } else {
                        console.error('List not found');
                    }
                });
        }
    }, [editList]);

    const handleDeleteList = async (listName) => {
        try {
            console.log('Deleting list:', listName);

            const response = await fetch(`/superhero-lists/${listName}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setLists((prevLists) => prevLists.filter((list) => list.name !== listName));
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

    const handleEditList = async (list) => {
        if (list) {
            const listData = await fetchListById(list.id);
            if (listData) {
                setEditList(listData);
            } else {
                console.error('List not found');
            }
        } else {
            console.error('List object is null or undefined');
        }
    };



    const handleSaveEdit = () => {
        setEditList(null);
        fetchListById();
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
                                    onClick={() => handleEditList(list.name)}
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
