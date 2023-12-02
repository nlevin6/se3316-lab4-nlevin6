import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import AdminForm from "./components/AdminForm";

const AdminPage = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserRole(user.email === 'admin@lab4.com' ? 'admin' : 'user');
            } else {
                setUserRole(null);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (userRole !== 'admin') {
            alert("You are not authorized to view this page.");
            navigate('/superhero-search');
        }
    }, [userRole, navigate]);

    return (
        <div className="text-center">
            <AdminForm/>
        </div>
    );
};

export default AdminPage;
