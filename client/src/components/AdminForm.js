import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminForm = ({ registeredEmails }) => {
    const [selectedEmail, setSelectedEmail] = useState('');
    const [emailRoles, setEmailRoles] = useState({});
    const navigate = useNavigate(); // Hook for navigation

    const handleEmailSelection = (email) => {
        setSelectedEmail(email);
    };

    const handleRoleChange = (email, selectedRole) => {
        setEmailRoles((prevRoles) => ({ ...prevRoles, [email]: selectedRole }));
    };

    return (
        <div className="max-w-screen-xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
            <div className="bg-white rounded p-4 shadow">
                <div className="flex mb-4">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => {
                            navigate('/superhero-search');
                        }}
                    >
                        Back
                    </button>
                </div>
                <h2 className="text-xl font-semibold mb-2">List of Registered Emails:</h2>
                <ul>
                    {registeredEmails
                        .filter((email) => email !== 'admin@lab4.com')
                        .map((email, index) => (
                            <li key={index} className="flex justify-between items-center mb-2">
                                <span
                                    className="text-blue-500 cursor-pointer"
                                    onClick={() => handleEmailSelection(email)}
                                >
                                    {email}
                                </span>
                                <div className="relative">
                                    <select
                                        className="bg-gray-200 border border-gray-300 rounded px-2 py-1"
                                        value={emailRoles[email] || 'user'}
                                        onChange={(e) =>
                                            handleRoleChange(email, e.target.value)
                                        }
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminForm;
