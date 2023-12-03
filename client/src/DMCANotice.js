import React from 'react';
import { Link } from 'react-router-dom';

const DMCANotice = () => {
    return (
        <div className="max-w-screen-lg mx-auto p-8">
            <Link to="/superhero-search-page" className="text-blue-500 mb-4 inline-block">&lt; Back</Link>
            <h1 className="text-3xl font-bold mb-6">DMCA Notice & Takedown Policy</h1>

            <h2 className="text-xl font-bold mb-2">Copyright Infringement Notification</h2>
            <p>If you believe that your copyright-protected work has been used on our platform without authorization, please send a notification to our designated agent including the following:</p>
            <ul className="list-disc pl-6 mb-4">
                <li>A physical or electronic signature of the copyright owner or a person authorized to act on their behalf</li>
                <li>Identification of the copyrighted work claimed to have been infringed</li>
                <li>Identification of the infringing material and its location on our platform</li>
                <li>Contact information of the notifier, including address, phone number, and email</li>
                <li>A statement that the notifier has a good faith belief that the use is not authorized by the copyright owner</li>
                <li>A statement that the information provided is accurate and, under penalty of perjury, that the notifier is authorized to act on behalf of the copyright owner</li>
            </ul>

            <h2 className="text-xl font-bold mb-2">Counter Notification</h2>
            <p>If you believe that material you submitted was removed or access was disabled and it was a mistake or misidentification, you may submit a counter notification including:</p>
            <ul className="list-disc pl-6 mb-4">
                <li>Your physical or electronic signature</li>
                <li>Identification of the material that has been removed or to which access has been disabled</li>
                <li>A statement under penalty of perjury that you have a good faith belief that removal or disablement was a mistake or misidentification</li>
                <li>Your name, address, and telephone number</li>
                <li>A statement that you consent to the jurisdiction of the federal district court for the judicial district in which your address is located</li>
                <li>A statement that you will accept service of process from the party who submitted the DMCA notification or an agent of that party</li>
            </ul>

            <h2 className="text-xl font-bold mb-2">Contact Information</h2>
            <p>Please send DMCA notices and counter notifications to our designated agent at:</p>
            <p className="italic">Nikita Levin<br />1151 Richmond St, London, ON N6A 3K7<br />nlevin6@uwo.ca<br />(519) 661-2111</p>

            <h2 className="text-xl font-bold mb-2">Policy Changes</h2>
            <p>We may update this policy periodically. Check this page for the latest information.</p>
        </div>
    );
};

export default DMCANotice;
