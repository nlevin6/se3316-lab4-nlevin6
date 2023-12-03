import React, { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AboutPage from './AboutPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import SuperheroSearchPage from './SuperheroSearchPage';
import ViewListsPage from './ViewListsPage';
import ChangePasswordPage from "./ChangePasswordPage";
import AdminPage from "./AdminPage";
import SecurityPrivacyPolicy from "./SecurityPrivacyPolicy";
import AcceptableUsePolicy from "./AcceptableUsePolicy";
import DMCANotice from "./DMCANotice";

const auth = getAuth();

const App = () => {
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                user.getIdToken().then((token) => {
                    //console.log('JWT Token:', token);
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
                <Route path="/superhero-search-page" element={<SuperheroSearchPage />} />
                <Route path='/signup' element={<SignupPage />} />
                <Route path='view-lists' element={<ViewListsPage />} />
                <Route path='/change-password' element={<ChangePasswordPage />} />
                <Route path='/admin' element={<AdminPage />} />
                <Route path="/security-privacy-policy" element={<SecurityPrivacyPolicy />} />
                <Route path="/acceptable-use-policy" element={<AcceptableUsePolicy />} />
                <Route path="dmca-notice" element={<DMCANotice />} />
            </Routes>
        </Router>
    );
};

export default App;
