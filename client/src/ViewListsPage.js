// Import necessary dependencies
import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

const ViewListsPage = () => {
    const [lists, setLists] = useState([]);
    const authInstance = getAuth();
    const user = authInstance.currentUser;

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const response = await fetch('/superhero-lists', {
                    headers: {
                        Authorization: `Bearer ${await authInstance.currentUser.getIdToken()}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setLists(data.lists);
            } catch (error) {
                console.error('Error fetching lists:', error);
            }
        };

        if (authInstance.currentUser) {
            fetchLists();
        }
    }, [authInstance.currentUser]);


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
        // Use the browser's history to navigate back
        window.history.back();
    };

    const handleEditList = (listName) => {
        // Implement logic to navigate to the edit page for the list with listName
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Lists</h1>
            <button className="bg-blue-500 text-white py-2 px-4 rounded mb-2" onClick={handleGoBack}>
                Back
            </button>
            {lists.map((list) => (
                <div key={list.name} className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">{list.name}</h2>
                    <p>{list.description}</p>
                    {console.log('Visibility:', list.visibility)}
                    {console.log('User ID:', user && user.uid)}
                    {console.log('List User ID:', list.userId)}
                    {console.log('List Name:', list.name)}
                    {list.visibility === 'private' && user && user.uid === list.userId && (
                        <div>
                            {/* Conditionally render delete and edit buttons for private lists */}
                            <button onClick={() => handleDeleteList(list.name)}>Delete</button>
                            <button onClick={() => handleEditList(list.name)}>Edit</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ViewListsPage;
