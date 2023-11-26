import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import authConfig from './firebaseConfig';
import { initializeApp } from "firebase/app";

const app = initializeApp(authConfig);
const auth = getAuth(app);

const SignupForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const isEmailValid = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSignup = async () => {
        try {
            if (!isEmailValid(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            if (user) {
                await sendEmailVerification(user);

                // JWT token retrieval
                const token = await user.getIdToken();
                console.log('JWT Token:', token);
                alert('Registration successful. Please check your email for verification.');
            }
        } catch (error) {
            alert(error.message);
        }
    };


    return (
        <div className="text-center">
            <h1 className="text-3xl font-bold mb-6">Sign Up</h1>

            <form className="flex flex-col items-center justify-center">
                <div className="mb-4 flex items-center">
                    <label htmlFor="email" className="mr-2">
                        Email:
                    </label>
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
                    <label htmlFor="password" className="mr-2">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="border rounded py-2 px-3"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="mb-4 flex items-center">
                    <label htmlFor="confirmPassword" className="mr-2">
                        Confirm Password:
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="border rounded py-2 px-3"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <button
                    type="button"
                    className="bg-green-500 text-white py-2 px-4 rounded mb-2"
                    onClick={handleSignup}
                >
                    Sign Up
                </button>

                <Link to="/login" className="text-blue-500 mb-2">
                    Back to Login
                </Link>
            </form>
        </div>
    );
};

export default SignupForm;
