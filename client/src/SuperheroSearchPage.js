import React, {useState, useEffect} from 'react';
import {getAuth, onAuthStateChanged, signOut} from 'firebase/auth';
import SearchForm from "./components/SearchForm";
import SearchResults from "./components/SearchResults";
import CreateList from "./components/CreateList";
import {Link} from "react-router-dom";

const SuperheroSearchPage = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(null);
    const [isCreateListOpen, setIsCreateListOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const authInstance = getAuth();
        const unsubscribe = onAuthStateChanged(authInstance, (user) => {
            if (user) {
                user.getIdTokenResult().then((idTokenResult) => {
                    setIsAdmin(idTokenResult.claims.admin);
                });
            }
            setUser(user);
            setLoading(false);
        });
        return () => {
            unsubscribe();
        };
    }, []);


    const handleOpenCreateList = () => {
        setIsCreateListOpen(true);
    };

    const handleCloseCreateList = () => {
        setIsCreateListOpen(false);
    };

    const handleSearch = async (searchParams) => {
        console.log("search params: ", searchParams);
        try {
            const response = await fetch(`/superhero/search?${new URLSearchParams(searchParams)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            if (data.matchingSuperheroes && data.matchingSuperheroes.length > 0) {
                setSearchResults(data.matchingSuperheroes);
            } else {
                //no results found
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);

            //set state to indicate no results due to network error
            setSearchResults([]);
        }
    };

    const handleLogout = async () => {
        const authInstance = getAuth();

        try {
            await signOut(authInstance);
            //redirect to the login page after successful logout
            window.location.href = '/login';
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };


    return (
        <div>
            <button className="bg-red-500 text-white py-2 px-4 rounded mb-2 absolute top-4 right-4"
                    onClick={handleLogout}>
                Logout
            </button>
            {!loading && user && (
                <Link
                    to="/change-password"
                    className="bg-green-500 text-white py-2 px-4 rounded mb-2 absolute top-4 right-24"
                >
                    Settings
                </Link>
            )}
            {user && isAdmin &&  (
                <Link
                    to="/admin"
                    className="bg-yellow-600 text-white py-2 px-4 rounded mb-2 absolute top-4 right-34"
                >
                    Admin Panel
                </Link>
            )}
            <h1 className="text-3xl font-bold mb-6">Superhero Codex</h1>
            {!loading && user && (
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded mb-2"
                    onClick={handleOpenCreateList}
                >
                    Create List
                </button>
            )}
            <Link
                to="/view-lists"
                className="bg-green-500 text-white py-2 px-4 rounded mb-2"
            >
                View Lists
            </Link>
            {isCreateListOpen && <CreateList onClose={handleCloseCreateList}/>}
            <SearchForm onSearch={handleSearch}/>
            <SearchResults results={searchResults}/>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-200">
                <div className="flex items-center justify-center">
                    <span className="text-blue-500">
                        <Link to="/security-privacy-policy" className="hover:underline">
                            Security and Privacy Policy
                        </Link>
                    </span>
                    <span className="mx-2 text-gray-500">|</span>
                    <span className="text-blue-500">
                        <Link to="/acceptable-use-policy" className="hover:underline">
                            Acceptable Use Policy
                        </Link>
                    </span>
                    <span className="mx-2 text-gray-500">|</span>
                    <span className="text-blue-500">
                        <Link to="/dmca-notice" className="hover:underline">
                            DMCA Notice & Takedown Policy
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SuperheroSearchPage;
