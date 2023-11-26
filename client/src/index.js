import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/tailwind.css';
import { auth } from './components/firebase'; // Import the initialized firebase auth

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
