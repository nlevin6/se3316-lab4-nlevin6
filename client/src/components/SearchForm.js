import React, {useState, useEffect} from 'react';

const SearchForm = ({onSearch}) => {
    const [searchParams, setSearchParams] = useState({
        name: '',
        power: '',
        race: '',
        publisher: '', // Changed from 'n' to 'publisher'
    });

    const [publishers, setPublishers] = useState([]);

    useEffect(() => {
        fetch('/publishers')
            .then(response => response.json())
            .then(data => setPublishers(data))
            .catch(error => console.error('Error fetching publishers:', error));
    }, []);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setSearchParams((prevParams) => ({...prevParams, [name]: value}));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchParams);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input className="border rounded py-2 px-3" type="text" name="name" value={searchParams.name}
                       onChange={handleInputChange}/>
            </label>
            <label>
                Power:
                <input className="border rounded py-2 px-3" type="text" name="power" value={searchParams.power}
                       onChange={handleInputChange}/>
            </label>
            <label>
                Race:
                <input className="border rounded py-2 px-3" type="text" name="race" value={searchParams.race}
                       onChange={handleInputChange}/>
            </label>
            <label>
                Publisher:
                <select className="border rounded py-2 px-3" name="publisher" value={searchParams.publisher}
                        onChange={handleInputChange}>
                    <option value="">Select a Publisher</option>
                    {publishers.map((publisher, index) => (
                        <option key={index} value={publisher}>
                            {publisher}
                        </option>
                    ))}
                </select>
            </label>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded mb-2">Search</button>
        </form>
    );
};

export default SearchForm;
