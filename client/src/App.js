import React, { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AboutPage from './AboutPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import SuperheroSearchPage from './SuperheroSearchPage';
import ViewListsPage from './ViewListsPage';
import ChangePasswordPage from "./ChangePasswordPage";

const auth = getAuth();

const App = () => {
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                user.getIdToken().then((token) => {
                    console.log('JWT Token:', token);
                });
            } else {
                // User is signed out
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/superhero-search" element={<SuperheroSearchPage />} />
                <Route path='/signup' element={<SignupPage />} />
                <Route path='view-lists' element={<ViewListsPage />} />
                <Route path='/change-password' element={<ChangePasswordPage />} />
            </Routes>
        </Router>
    );
};

export default App;
