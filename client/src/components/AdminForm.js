import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, getIdTokenResult } from 'firebase/auth';

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
                    const response = await fetch(`/get-user-role?email=${email}`);
                    const data = await response.json();

                    if (response.ok) {
                        return { email, role: data.role || 'user' };
                    } else {
                        console.error(`Error fetching user role for ${email}: ${data.error}`);
                        return { email, role: 'user' };
                    }
                } catch (error) {
                    console.error(`Error fetching user role for ${email}: ${error}`);
                    return { email, role: 'user' };
                }
            });

            const roles = await Promise.all(rolesPromises);

            const initialRoles = {};
            roles.forEach(({ email, role }) => {
                initialRoles[email] = role;
            });

            setEmailRoles(initialRoles);
        };

        fetchUserRoles();
    }, [registeredEmails]);


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
                [email]: selectedRole,
            }));
        } catch (error) {
            console.error('Error updating user role:', error);
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
                                        onChange={(e) => handleRoleChange(email, e.target.value)}
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
