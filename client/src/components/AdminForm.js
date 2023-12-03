import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const AdminForm = ({ registeredEmails }) => {
    const [selectedEmail, setSelectedEmail] = useState('');
    const [emailRoles, setEmailRoles] = useState({});
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(null);

    useEffect(() => {
        const authInstance = getAuth();

        const unsubscribe = onAuthStateChanged(authInstance, (user) => {
            if (user) {
                user.getIdTokenResult().then((idTokenResult) => {
                    setIsAdmin(idTokenResult.claims.admin);
                });
            }
            setUser(user);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        const fetchUserRoles = async () => {
            const rolesPromises = registeredEmails.map(async (email) => {
                try {
                    const response = await fetch(`/get-user-role-and-status?email=${email}`);
                    const data = await response.json();

                    if (response.ok) {
                        return { email, role: data.role || 'user', status: data.status || 'enabled' };
                    } else {
                        console.error(`Error fetching user role or account status for ${email}`);
                        return { email, role: 'user', status: 'enabled' };
                    }
                } catch (error) {
                    console.error(`Error fetching user role or account status for ${email}: ${error}`);
                    return { email, role: 'user', status: 'enabled' };
                }
            });

            const roles = await Promise.all(rolesPromises);

            const initialRoles = {};
            roles.forEach(({ email, role, status }) => {
                initialRoles[email] = { role, status };
            });

            setEmailRoles(initialRoles);
        };

        fetchUserRoles();
    }, [registeredEmails]);

    // useEffect to watch for changes in emailRoles and trigger actions
    useEffect(() => {
        // You can perform any additional actions here when emailRoles state changes
        console.log('Email roles updated:', emailRoles);
    }, [emailRoles]);

    const handleEmailSelection = (email) => {
        setSelectedEmail(email);
    };

    const handleRoleChange = async (email, selectedRole) => {
        try {
            await fetch('/update-user-role', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, role: selectedRole }),
            });

            setEmailRoles((prevRoles) => ({
                ...prevRoles,
                [email]: { ...prevRoles[email], role: selectedRole },
            }));
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    };

    const handleToggleEnableDisable = async (email) => {
        try {
            const response = await fetch(`/toggle-enable-disable?email=${email}`, {
                method: 'PUT',
            });

            const data = await response.json();

            if (response.ok) {
                setEmailRoles((prevRoles) => ({
                    ...prevRoles,
                    [email]: { ...prevRoles[email], status: data.status === 'enabled' ? 'user' : 'disabled' },
                }));

                alert(`Account ${data.status === 'enabled' ? 'enabled' : 'disabled'} for ${email}`);
            } else {
                console.error(`Error toggling enable/disable for ${email}: ${data.error}`);
            }
        } catch (error) {
            console.error(`Error toggling enable/disable for ${email}: ${error}`);
        }
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
                        .filter((email) => email !== 'admin@lab4.com' && email !== user?.email)
                        .map((email, index) => (
                            <li key={index} className="flex justify-between items-center mb-2">
                            <span
                                className="text-blue-500 cursor-pointer"
                                onClick={() => handleEmailSelection(email)}
                            >
                                {email}
                            </span>
                                <div className="flex items-center">
                                    <button
                                        className={`p-1 ${
                                            emailRoles[email]?.status === 'disabled' ? 'bg-green-500' : 'bg-red-500'
                                        } text-white rounded`}
                                        onClick={() => handleToggleEnableDisable(email)}
                                    >
                                        {emailRoles[email]?.status === 'disabled' ? 'Enable' : 'Disable'}
                                    </button>
                                    <div className="relative ml-2">
                                        <select
                                            className="bg-gray-200 border border-gray-300 rounded px-2 py-1"
                                            value={emailRoles[email]?.role || 'user'}
                                            onChange={(e) => handleRoleChange(email, e.target.value)}
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );

};

export default AdminForm;
