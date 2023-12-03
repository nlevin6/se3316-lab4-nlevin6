import React, { useState } from 'react';
import { getAuth, reauthenticateWithCredential, updatePassword, EmailAuthProvider, signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';

const SettingsForm = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [validPasswordLength, setValidPasswordLength] = useState(true);

    const handleUpdatePassword = async () => {
        if (newPassword.length < 6 || confirmNewPassword.length < 6) {
            setValidPasswordLength(false);
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setPasswordsMatch(false);
            return;
        }

        const authInstance = getAuth();
        const user = authInstance.currentUser;

        if (!user) {
            return;
        }
        const userEmail = user.email;
        if (!userEmail) {
            return;
        }
        const credential = EmailAuthProvider.credential(userEmail, oldPassword);

        try {
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);

            setOldPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setPasswordsMatch(true);
            setValidPasswordLength(true);

            alert('Password changed successfully! Logging out...');
            await signOut(authInstance);
            window.location.href = '/login';
        } catch (error) {
            console.error('Error reauthenticating:', error);
            alert('Old password is incorrect.');
        }
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                <Link to="/superhero-search-page" className="bg-blue-500 text-white py-2 px-4 rounded mb-2 absolute top-4 right-4">
                    Back
                </Link>
            </div>
            <h2 className="text-2xl font-bold mb-4">Change Password</h2>
            <form className="max-w-md mx-auto">
                <div className="mb-4 flex flex-col">
                    <label htmlFor="oldPassword" className="text-sm font-semibold text-gray-600 mb-1">
                        Old Password:
                    </label>
                    <input
                        type="password"
                        id="oldPassword"
                        name="oldPassword"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full border rounded py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="mb-4 flex flex-col">
                    <label htmlFor="newPassword" className="text-sm font-semibold text-gray-600 mb-1">
                        New Password:
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border rounded py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="mb-4 flex flex-col">
                    <label htmlFor="confirmNewPassword" className="text-sm font-semibold text-gray-600 mb-1">
                        Confirm New Password:
                    </label>
                    <input
                        type="password"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full border rounded py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                </div>
                {!passwordsMatch && (
                    <p className="text-red-500 mb-2">New password and confirm new password do not match.</p>
                )}
                {!validPasswordLength && (
                    <p className="text-red-500 mb-2">Password should be at least 6 characters long.</p>
                )}
                <button
                    type="button"
                    className="bg-blue-500 text-white py-2 px-4 rounded focus:outline-none hover:bg-blue-600"
                    onClick={handleUpdatePassword}
                >
                    Update Password
                </button>
            </form>
        </div>
    );
};

export default SettingsForm;
