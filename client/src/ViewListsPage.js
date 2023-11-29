import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

const ViewListsPage = () => {
    const [lists, setLists] = useState([]);
    const authInstance = getAuth();
    const user = authInstance.currentUser;

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const response = await fetch('/superhero-lists');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setLists(data.lists);
            } catch (error) {
                console.error('Error fetching lists:', error);
            }
        };

        fetchLists();
    }, []);

    const handleDeleteList = async (listName) => {
        try {
            console.log('Deleting list:', listName);

            const response = await fetch(`/superhero-lists/${listName}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                // Update the state to remove the deleted list
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

    const handleEditList = (listName) => {
        // Logic to edit a list here later
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

                        {user && (
                            <div>
                                <button
                                    style={{
                                        backgroundColor: 'red',
                                        color: 'white',
                                        padding: '8px',
                                        marginRight: '4px',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => handleDeleteList(list.name)}
                                >
                                    Delete
                                </button>
                                <button
                                    style={{
                                        backgroundColor: 'blue',
                                        color: 'white',
                                        padding: '8px',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => handleEditList(list.name)}
                                >
                                    Edit
                                </button>
                            </div>
                        )}

                    </div>
                )
            ))}
        </div>
    );
};

export default ViewListsPage;
