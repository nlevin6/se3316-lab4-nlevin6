import React from 'react';
import { Link } from 'react-router-dom';

const AcceptableUsePolicy = () => {
    return (
        <div className="max-w-screen-lg mx-auto p-8">
            <Link to="/superhero-search-page" className="text-blue-500 mb-4 inline-block">&lt; Back</Link>
            <h1 className="text-3xl font-bold mb-6">Acceptable Use Policy</h1>

            <h2 className="text-xl font-bold mb-2">Introduction</h2>
            <p>This Acceptable Use Policy outlines the terms and conditions for using our services. By accessing and using our services, you agree to comply with this policy.</p>

            <h2 className="text-xl font-bold mb-2">Prohibited Activities</h2>
            <p>Users are prohibited from engaging in the following activities:</p>
            <ul className="list-disc pl-6 mb-4">
                <li>Violating any applicable laws or regulations</li>
                <li>Harassing, threatening, or infringing on the rights of others</li>
                <li>Uploading or distributing malicious software or content</li>
                <li>Unauthorized access or attempts to access restricted areas</li>
                <li>Any activity that may harm or disrupt our services</li>
            </ul>

            <h2 className="text-xl font-bold mb-2">User Responsibilities</h2>
            <p>Users are responsible for:</p>
            <ul className="list-disc pl-6 mb-4">
                <li>Protecting their account credentials and personal information</li>
                <li>Using the services in compliance with applicable laws</li>
                <li>Reporting any security vulnerabilities or incidents</li>
                <li>Respecting the rights and privacy of others</li>
            </ul>

            <h2 className="text-xl font-bold mb-2">Consequences of Violation</h2>
            <p>Violations of this policy may result in:</p>
            <ul className="list-disc pl-6 mb-4">
                <li>Account suspension or termination</li>
                <li>Legal action if warranted</li>
                <li>Notification to law enforcement authorities</li>
            </ul>

            <h2 className="text-xl font-bold mb-2">Policy Changes</h2>
            <p>We may update this policy periodically. Check this page for the latest information.</p>

            <h2 className="text-xl font-bold mb-2">Contact Us</h2>
            <p>If you have questions or concerns about our Acceptable Use Policy, please contact us at <span className="text-blue-500">admin@lab4.com</span>.</p>
        </div>
    );
};

export default AcceptableUsePolicy;
