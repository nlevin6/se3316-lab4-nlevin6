import React from 'react';
import {Link} from 'react-router-dom';

const AboutPage = () => {
    return (
        <div className="text-center">
            <h1 className="text-3xl font-bold mb-6">About</h1>

            <div className="flex flex-col items-center justify-center">
                <p className="ml-10 text-center">
                    This is a simple web application that allows users to search for superheroes.<br/>
                    Feel free to Sign Up and Login to use the application.<br/>

                    You may also use the Guest Login button to login as a guest. However, you will not be able to access<br/>
                    all the features of the application.<br/>
                </p>

                <Link to="/login" className="bg-blue-500 text-white py-2 px-4 rounded mt-3">
                    Redirect to Login Page
                </Link>
            </div>
        </div>
    );
}

export default AboutPage;
