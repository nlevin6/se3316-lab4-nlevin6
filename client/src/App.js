import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AboutPage from './AboutPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import SuperheroSearchPage from './SuperheroSearchPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/superhero-search" element={<SuperheroSearchPage />} />
                <Route path='/signup' element={<SignupPage />} />
            </Routes>
        </Router>
    );
};

export default App;
