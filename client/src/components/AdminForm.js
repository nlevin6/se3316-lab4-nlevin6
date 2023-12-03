import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import DmcaForm from './DmcaForm';

const AdminForm = ({registeredEmails}) => {
    const [selectedEmail, setSelectedEmail] = useState('');
    const [emailRoles, setEmailRoles] = useState({});
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(null);
    const [showDmcaForm, setShowDmcaForm] = useState(false);
    const [dmcaDisputes, setDmcaDisputes] = useState([]);

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
                        return {email, role: data.role || 'user', status: data.status || 'enabled'};
                    } else {
                        console.error(`Error fetching user role or account status for ${email}`);
                        return {email, role: 'user', status: 'enabled'};
                    }
                } catch (error) {
                    console.error(`Error fetching user role or account status for ${email}: ${error}`);
                    return {email, role: 'user', status: 'enabled'};
                }
            });

            const roles = await Promise.all(rolesPromises);

            const initialRoles = {};
            roles.forEach(({email, role, status}) => {
                initialRoles[email] = {role, status};
            });

            setEmailRoles(initialRoles);
        };

        fetchUserRoles();
    }, [registeredEmails]);

    useEffect(() => {
        console.log('Email roles updated:', emailRoles);
    }, [emailRoles]);

    useEffect(() => {
        const fetchDmcaDisputes = async () => {
            try {
                const response = await fetch('/get-dmca-requests');
                const data = await response.json();

                if (response.ok) {
                    console.log('DMCA Disputes Response:', data);
                    setDmcaDisputes(data);
                } else {
                    console.error('Error fetching DMCA disputes:', data.error);
                }
            } catch (error) {
                console.error('Error fetching DMCA disputes:', error);
            }
        };

        fetchDmcaDisputes();
    }, []);



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
                body: JSON.stringify({email, role: selectedRole}),
            });

            setEmailRoles((prevRoles) => ({
                ...prevRoles,
                [email]: {...prevRoles[email], role: selectedRole},
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
                    [email]: {...prevRoles[email], status: data.status === 'enabled' ? 'user' : 'disabled'},
                }));

                alert(`Account ${data.status === 'enabled' ? 'enabled' : 'disabled'} for ${email}`);
            } else {
                console.error(`Error toggling enable/disable for ${email}: ${data.error}`);
            }
        } catch (error) {
            console.error(`Error toggling enable/disable for ${email}: ${error}`);
        }
    };
    useEffect(() => {
        console.log('DMCA Disputes:', dmcaDisputes);
    }, [dmcaDisputes]);


    const handleDmcaForm = () => {
        setShowDmcaForm(true);
    };

    const handleDmcaFormClose = () => {
        setShowDmcaForm(false);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/delete-dmca-request/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setDmcaDisputes((prevDisputes) =>
                    prevDisputes.filter((dispute) => dispute.id !== id)
                );
                console.log('DMCA dispute deleted successfully');
            } else {
                console.error('Failed to delete DMCA dispute');
            }
        } catch (error) {
            console.error('Error deleting DMCA dispute:', error);
        }
    };

    const updateDmcaDisputes = (newDispute) => {
        setDmcaDisputes((prevDisputes) => [...prevDisputes, newDispute]);
    };

    return (
        <div className="max-w-screen-xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
            <div className="bg-white rounded p-4 shadow">
                <div className="flex mb-4">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => {
                            navigate('/superhero-search-page');
                        }}
                    >
                        Back
                    </button>
                </div>
                <h2 className="text-xl font-semibold mb-2">List of Registered Emails</h2>
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

            <div className='bg-white rounded p-4 shadow'>
                <h2 className="text-xl font-semibold mb-2">DMCA Takedown</h2>
                <div>
                    <p>
                        To file a DMCA Takedown ticket, please fill out the date of the dispute, the date you have sent the notice, and the date you have received the request.
                        Fill in any notes you may have and select the status of the dispute.
                    </p>
                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded mb-2"
                        onClick={handleDmcaForm}
                    >
                        File DMCA Takedown
                    </button>

                    {showDmcaForm && (
                        <div
                            className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                            <DmcaForm onClose={handleDmcaFormClose} onUpdateDisputes={updateDmcaDisputes}/>
                        </div>
                    )}
                    {/* Display DMCA disputes */}
                    <h3 className="text-lg font-semibold mt-4">DMCA Disputes</h3>
                    {Array.isArray(dmcaDisputes) && dmcaDisputes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {dmcaDisputes.map((dispute, index) => (
                                <div key={index} className="bg-white p-4 rounded-md shadow-md">
                                    <p className="text-gray-600 font-semibold mb-2">Date Dispute Received:</p>
                                    <p className="text-gray-600 mb-2">{dispute.dateDisputeReceived}</p>

                                    <p className="text-gray-600 font-semibold mb-2">Date Notice Sent:</p>
                                    <p className="text-gray-600 mb-2">{dispute.dateNoticeSent}</p>

                                    <p className="text-gray-600 font-semibold mb-2">Date Request Received:</p>
                                    <p className="text-gray-600 mb-2">{dispute.dateRequestReceived}</p>

                                    <p className="text-gray-600 font-semibold mb-2">Notes:</p>
                                    <p className="text-gray-600 mb-2">{dispute.notes}</p>

                                    <p className="text-gray-600 font-semibold mb-2">Status:</p>
                                    <p className="text-gray-600 mb-2">{dispute.status}</p>

                                    <button
                                        className="text-red-500 hover:text-red-700 cursor-pointer"
                                        onClick={() => handleDelete(dispute.id)}
                                    >
                                        Delete
                                    </button>
                                </div>

                            ))}

                        </div>
                    ) : (
                        <p>No DMCA disputes found.</p>
                    )}



                </div>
            </div>
        </div>
    );

};

export default AdminForm;
