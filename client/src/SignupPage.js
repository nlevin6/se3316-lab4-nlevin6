import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import SignupForm from "./components/SignupForm";

const SignupPage = () => {
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
            <SignupForm />
        </div>
    );
};

export default SignupPage;
