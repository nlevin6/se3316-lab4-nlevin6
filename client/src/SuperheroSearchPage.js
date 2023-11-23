import React from 'react';
import {useNavigate} from 'react-router-dom';

const SuperheroSearchPage = () => {
    const navigate = useNavigate();

    // Dummy guest login functionality
    const handleGuestLogin = () => {
        // Perform any login logic if needed
        // For now, just navigate to the superhero search page
        navigate('/superhero-search');
    };

    return (
        <div>
            <h1>Superhero Search</h1>
            {/* Your superhero search functionality here */}
            <button onClick={handleGuestLogin}>Guest Login</button>
        </div>
    );
};

export default SuperheroSearchPage;
