import React from "react";
import { Link } from "react-router-dom";

const SignupForm = () => {
    return (
        <div className="text-center">
            <h1 className="text-3xl font-bold mb-6">Sign Up</h1>

            <form className="flex flex-col items-center justify-center">
                <div className="mb-4 flex items-center">
                    <label htmlFor="username" className="mr-2">
                        Username:
                    </label>
                    <input type="text" id="username" name="username" className="border rounded py-2 px-3" />
                </div>

                <div className="mb-4 flex items-center">
                    <label htmlFor="password" className="mr-2">
                        Password:
                    </label>
                    <input type="password" id="password" name="password" className="border rounded py-2 px-3" />
                </div>

                <div className="mb-4 flex items-center">
                    <label htmlFor="email" className="mr-2">
                        Email:
                    </label>
                    <input type="text" id="email" name="email" className="border rounded py-2 px-3" />
                </div>

                <button type="button" className="bg-green-500 text-white py-2 px-4 rounded mb-2">
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
