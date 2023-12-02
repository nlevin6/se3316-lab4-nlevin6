import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AdminForm from "./components/AdminForm";
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

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

        return () => {
            unsubscribe();
        };
    }, [navigate]);

    return (
        <div className="text-center">
            <AdminForm />
        </div>
    );
};

export default AdminPage;
