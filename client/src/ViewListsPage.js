import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import EditList from './components/EditList';

const ViewListsPage = () => {
    const [lists, setLists] = useState([]);
    const [expandedLists, setExpandedLists] = useState([]);
    const [editList, setEditList] = useState(null);
    const [ratingValue, setRatingValue] = useState(1);
    const [commentValue, setCommentValue] = useState('');

    const authInstance = getAuth();
    const user = authInstance.currentUser;

    const fetchSuperheroLists = async () => {
        try {
            const response = await fetch('/superhero-lists');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            // Sort the lists based on the modifiedAt timestamp in descending order
            const sortedLists = data.lists.sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt));

            setLists(sortedLists || []);
            setExpandedLists(new Array(sortedLists.length).fill(false));
        } catch (error) {
            console.error('Error fetching superhero lists:', error);
        }
    };

    useEffect(() => {
        fetchSuperheroLists();
    }, []);

    const handleDeleteList = async (listId) => {
        try {
            const response = await fetch(`/superhero-lists/${listId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setLists((prevLists) => {
                    const updatedLists = prevLists.filter((list) => list.id !== listId);
                    setExpandedLists((prevExpandedLists) =>
                        prevExpandedLists.filter((_, index) => index !== prevLists.findIndex((list) => list.id === listId))
                    );
                    return updatedLists;
                });
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

    const handleExpandToggle = (index) => {
        setExpandedLists((prevExpandedLists) => {
            const newExpandedLists = [...prevExpandedLists];
            newExpandedLists[index] = !newExpandedLists[index];
            return newExpandedLists;
        });
    };

    const handleSaveEdit = () => {
        setEditList(null);
        fetchSuperheroLists();
    };

    const handleCloseEdit = () => {
        setEditList(null);
    };

    const handleSubmitRating = async (event, listId) => {
        event.preventDefault();

        if (!listId) {
            console.error('List ID is null or undefined');
            return;
        }

        try {
            const response = await fetch(`/superhero-lists/${listId}/ratings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rating: String(ratingValue),
                    comment: commentValue,
                }),
            });

            if (response.ok) {
                fetchSuperheroLists();
                setRatingValue(1);
                setCommentValue('');
            } else {
                console.error('Error submitting rating:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };


    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Lists</h1>
            <button className="bg-blue-500 text-white py-2 px-4 rounded mb-2" onClick={handleGoBack}>
                Back
            </button>
            {lists.map((list, index) => (
                <div key={list.name} className="mb-4 p-4 border border-gray-300 rounded">
                    <div className="flex justify-between items-center">
                        <button className="text-xl font-semibold mb-2 cursor-pointer" onClick={() => handleExpandToggle(index)}>
                            {list.name}
                        </button>
                        {user && (
                            <div>
                                <button
                                    className="bg-red-500 text-white py-2 px-4 rounded mr-2 cursor-pointer"
                                    onClick={() => handleDeleteList(list.id)}
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
                    {expandedLists[index] && (
                        <div>
                            <p>Last modified at: {new Date(list.modifiedAt).toLocaleString()}</p>
                            <p>{list.description}</p>
                            {list.superheroes && list.superheroes.length > 0 && (
                                <div className="bg-gray-100 p-4 mt-4 border border-gray-300 rounded">
                                    <h3 className="text-lg font-semibold">Heroes:</h3>
                                    <ul>
                                        {list.superheroes.map((hero, heroIndex) => (
                                            <li key={heroIndex}>{hero.name} - {hero.Publisher}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {/* Display Ratings and Comments */}
                            {list.ratings && list.ratings.length > 0 && (
                                <div className="bg-gray-100 p-4 mt-4 border border-gray-300 rounded">
                                    <h3 className="text-lg font-semibold">Ratings and Comments:</h3>
                                    <ul>
                                        {list.ratings.map((rating, ratingIndex) => (
                                            <li key={ratingIndex}>
                                                {rating.rating} stars - {rating.comment}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <form onSubmit={(event) => handleSubmitRating(event, list.id)} className="mt-4">
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-600 mb-1" htmlFor="rating">
                                        Rating:
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={ratingValue}
                                        onChange={(e) => setRatingValue(e.target.value)}
                                        className="w-full border rounded py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-600 mb-1" htmlFor="comment">
                                        Comment:
                                    </label>
                                    <textarea
                                        value={commentValue}
                                        onChange={(e) => setCommentValue(e.target.value)}
                                        className="w-full border rounded py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white py-2 px-4 rounded focus:outline-none hover:bg-blue-600"
                                >
                                    Submit Rating
                                </button>
                            </form>


                        </div>
                    )}
                </div>
            ))}
            {editList && (
                <EditList listId={editList.id} initialListName={editList.name} onClose={handleCloseEdit} onSave={handleSaveEdit} />
            )}
        </div>
    );
};

export default ViewListsPage;
