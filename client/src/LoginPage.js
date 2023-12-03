import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import LoginForm from "./components/LoginForm";

const LoginPage = () => {
    const authInstance = getAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(authInstance, (user) => {
            if (user) {
                navigate('/superhero-search-page');
            }
        });
        return () => {
            unsubscribe();
        };
    }, [authInstance, navigate]);

    return (
        <div className="text-center">
            <LoginForm />
        </div>
    );
};

export default LoginPage;
