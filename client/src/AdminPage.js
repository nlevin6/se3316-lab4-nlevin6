import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import AdminForm from "./components/AdminForm";

const AdminPage = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserRole(user.email === 'admin@lab4.com' ? 'admin' : 'user');
            } else {
                setUserRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!loading && userRole !== 'admin') {
            alert("You are not authorized to view this page.");
            navigate('/superhero-search');
        }
    }, [loading, userRole, navigate]);

    return (
        <div className="text-center">
            <Link to="/superhero-search" className="absolute top-0 left-0 m-4">
                <button className="bg-blue-500 text-white py-2 px-4 rounded">Back</button>
            </Link>

            {loading ? (
                <p>Loading...</p>
            ) : (
                userRole === 'admin' && <AdminForm />
            )}
        </div>
    );
};

export default AdminPage;
