import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AboutPage from './AboutPage';
import LoginPage from './LoginPage';
import SuperheroSearchPage from './SuperheroSearchPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/superhero-search" element={<SuperheroSearchPage />} />
            </Routes>
        </Router>
    );
};

export default App;
