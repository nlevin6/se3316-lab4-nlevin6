import React from 'react';
import { Link } from 'react-router-dom';

const SecurityPrivacyPolicy = () => {
    return (
        <div className="max-w-screen-lg mx-auto p-8">
            <Link to="/superhero-search" className="text-blue-500 mb-4 inline-block">&lt; Back</Link>
            <h1 className="text-3xl font-bold mb-6">Security and Privacy Policy</h1>

            <h2 className="text-xl font-bold mb-2">Data Collection and Usage</h2>
            <p>We collect and use personal information for the following purposes:</p>
            <ul className="list-disc pl-6 mb-4">
                <li>Provide and maintain our services</li>
                <li>Improve, personalize, and expand our services</li>
                <li>Communicate with you, including customer support</li>
            </ul>

            <h2 className="text-xl font-bold mb-2">Data Protection</h2>
            <p>We take appropriate measures to protect your personal information. This includes encryption, secure data storage, and access controls.</p>

            <h2 className="text-xl font-bold mb-2">Cookies</h2>
            <p>We use cookies to improve your experience on our website. You can control cookies through your browser settings.</p>

            <h2 className="text-xl font-bold mb-2">Third-Party Services</h2>
            <p>We may use third-party services for analytics, advertising, and other purposes. These services have their privacy policies, and we encourage you to review them.</p>

            <h2 className="text-xl font-bold mb-2">Information Sharing</h2>
            <p>We do not sell or rent your personal information to third parties. We may share information with trusted partners for specific purposes outlined in this policy.</p>

            <h2 className="text-xl font-bold mb-2">Security Incidents</h2>
            <p>In the event of a security incident, we will notify affected users and take appropriate measures to address the breach.</p>

            <h2 className="text-xl font-bold mb-2">Policy Changes</h2>
            <p>We may update this policy periodically. Check this page for the latest information.</p>

            <h2 className="text-xl font-bold mb-2">Contact Us</h2>
            <p>If you have questions or concerns about our security and privacy practices, please contact us at <span className="text-blue-500">admin@lab4.com</span>.</p>
        </div>
    );
};

export default SecurityPrivacyPolicy;
