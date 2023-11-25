import React, {useState, useEffect} from 'react';

const SearchForm = ({onSearch}) => {
    const [searchParams, setSearchParams] = useState({
        name: '',
        power: '',
        race: '',
        publisher: '',
    });

    const [publishers, setPublishers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/publishers')
            .then(response => response.json())
            .then(data => setPublishers(data.publishers.sort()))
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
        <form onSubmit={handleSubmit} className="flex space-x-10">
            <div className="flex flex-col">
                <label className="mb-1">
                    Name:
                    <input className="border rounded py-2 px-3" type="text" name="name" value={searchParams.name} onChange={handleInputChange} />
                </label>
            </div>
            <div className="flex flex-col">
                <label className="mb-1">
                    Power:
                    <input className="border rounded py-2 px-3" type="text" name="power" value={searchParams.power} onChange={handleInputChange} />
                </label>
            </div>
            <div className="flex flex-col">
                <label className="mb-1">
                    Race:
                    <input className="border rounded py-2 px-3" type="text" name="race" value={searchParams.race} onChange={handleInputChange} />
                </label>
            </div>
            <div className="flex flex-col">
                <label className="mb-1">
                    Publisher:
                    <select className="border rounded py-2 px-3" name="publisher" value={searchParams.publisher} onChange={handleInputChange}>
                        <option value="">Select a Publisher</option>
                        {publishers.map((publisher, index) => (
                            <option key={index} value={publisher}>
                                {publisher}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded mb-2">Search</button>
        </form>
    );


};

export default SearchForm;
