import React, { useState } from 'react';

const SearchForm = ({ onSearch }) => {
    const [searchParams, setSearchParams] = useState({
        name: '',
        power: '',
        race: '',
        n: 10, // Default number of searches
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchParams);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" name="name" value={searchParams.name} onChange={handleInputChange} />
            </label>
            <label>
                Power:
                <input type="text" name="power" value={searchParams.power} onChange={handleInputChange} />
            </label>
            <label>
                Race:
                <input type="text" name="race" value={searchParams.race} onChange={handleInputChange} />
            </label>
            <label>
                Number of Searches:
                <input type="number" name="n" value={searchParams.n} onChange={handleInputChange} />
            </label>
            <button type="submit">Search</button>
        </form>
    );
};

export default SearchForm;
