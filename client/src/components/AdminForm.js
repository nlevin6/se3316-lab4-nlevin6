import React, { useState } from 'react';

const AdminForm = () => {
    const [reviewId, setReviewId] = useState('');
    const [userId, setUserId] = useState('');
    const [markHidden, setMarkHidden] = useState(false);
    const [markDisabled, setMarkDisabled] = useState(false);


    const handleMarkUser = () => {
        // Implement logic to mark a user as disabled or clear the "disabled" flag
        console.log(`Mark User ${userId} as ${markDisabled ? 'disabled' : 'enabled'}`);
        // You may want to send a request to your backend to update the user status
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
            <div>
                <label htmlFor="userId" className="mb-2">
                    User ID:
                </label>
                <input
                    type="text"
                    id="userId"
                    name="userId"
                    className="border rounded py-2 px-3"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <button
                    type="button"
                    className="bg-red-500 text-white py-2 px-4 rounded mb-2 ml-2"
                    onClick={handleMarkUser}
                >
                    Mark User
                </button>
            </div>
            <div className="mt-4">
                <label htmlFor="markHidden" className="mr-2">
                    Mark as Hidden:
                </label>
                <input
                    type="checkbox"
                    id="markHidden"
                    name="markHidden"
                    checked={markHidden}
                    onChange={() => setMarkHidden(!markHidden)}
                />
            </div>
            <div className="mt-2">
                <label htmlFor="markDisabled" className="mr-2">
                    Mark as Disabled:
                </label>
                <input
                    type="checkbox"
                    id="markDisabled"
                    name="markDisabled"
                    checked={markDisabled}
                    onChange={() => setMarkDisabled(!markDisabled)}
                />
            </div>
        </div>
    );
};

export default AdminForm;
