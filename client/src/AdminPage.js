import React, {useState, useEffect} from 'react';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import AdminForm from "./components/AdminForm";
import {useNavigate} from 'react-router-dom';

const AdminPage = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [registeredEmails, setRegisteredEmails] = useState([]);

    useEffect(() => {
        const authInstance = getAuth();
        const unsubscribe = onAuthStateChanged(authInstance, (user) => {
            if (user) {
                user.getIdTokenResult().then((idTokenResult) => {
                    setIsAdmin(idTokenResult.claims.admin);
                    if (!idTokenResult.claims.admin) {
                        alert('You must be an admin to access this page.');
                        navigate('/superhero-search');
                    }
                });
            }
            setUser(user);
        });

        const fetchRegisteredEmails = async () => {
            try {
                const response = await fetch('/getRegisteredEmails');
                if (response.ok) {
                    const data = await response.json();
                    setRegisteredEmails(data);
                } else {
                    console.error('Error fetching registered emails:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error fetching registered emails:', error);
            }
        };

        // Call the fetchRegisteredEmails function here
        fetchRegisteredEmails();

        return () => {
            unsubscribe();
        };
    }, [navigate]);



    return (
        <div className="text-center">
            <AdminForm registeredEmails={registeredEmails}/>
        </div>
    );
};

export default AdminPage;
