import React from "react";
import {useNavigate} from "react-router-dom";

const LoginForm = () => {
    const navigate = useNavigate();

    const handleGuestLogin = () => {
        navigate("/superhero-search");
    }

    return (
        <div className="text-center">
            <h1 className="text-3xl font-bold mb-6">Login</h1>

            <form className="flex flex-col items-center justify-center">
                <div className="mb-4">
                    <label htmlFor="username" className="mb-2">Username:</label>
                    <input type="text" id="username" name="username" className="border rounded py-2 px-3"/>
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="mb-2">Password:</label>
                    <input type="password" id="password" name="password" className="border rounded py-2 px-3"/>
                </div>

                <button type="button" className="bg-green-500 text-white py-2 px-4 rounded mb-2">
                    Login
                </button>

                <button type="button" className="bg-blue-500 text-white py-2 px-4 rounded mb-2">
                    Sign Up
                </button>

                <button type="button" className="bg-gray-500 text-white py-2 px-4 rounded mb-2"
                        onClick={handleGuestLogin}>
                    Guest Login
                </button>
            </form>
        </div>
    );
}

export default LoginForm;
