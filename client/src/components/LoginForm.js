import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth';

const LoginForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserRole(user.email === 'admin@lab4.com' ? 'admin' : 'user');
            } else {
                setUserRole(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleGuestLogin = () => {
        navigate("/superhero-search-page");
    }

    const handleSignup = () => {
        navigate("/signup");
    }

    const handleLogin = async () => {
        try {
            const auth = getAuth();

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (user && user.emailVerified) {
                const token = await user.getIdToken();
                //console.log('JWT Token:', token);

                if (user.email === 'admin@lab4.com') {
                    alert('Head Admin login successful.');
                    navigate("/superhero-search-page");
                } else {
                    alert('Login successful.');
                    navigate("/superhero-search-page");
                }
            } else if (user && !user.emailVerified) {
                alert('Please verify your email before logging in.');
            }
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <div className="text-center">
            <h1 className="text-3xl font-bold mb-6">Login</h1>

            <form className="flex flex-col items-center justify-center">
                <div className="mb-4 flex items-center">
                    <label htmlFor="email" className="mb-2">Email:</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        className="border rounded py-2 px-3"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-4 flex items-center">
                    <label htmlFor="password" className="mb-2">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="border rounded py-2 px-3"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="button"
                    className="bg-green-500 text-white py-2 px-4 rounded mb-2"
                    onClick={handleLogin}
                >
                    Login
                </button>

                <button
                    type="button"
                    className="bg-blue-500 text-white py-2 px-4 rounded mb-2"
                    onClick={handleSignup}
                >
                    Sign Up
                </button>

                <button
                    type="button"
                    className="bg-gray-500 text-white py-2 px-4 rounded mb-2"
                    onClick={handleGuestLogin}
                >
                    Guest Login
                </button>
            </form>
        </div>
    );
}

export default LoginForm;
