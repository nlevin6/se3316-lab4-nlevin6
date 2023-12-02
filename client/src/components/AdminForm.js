import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const AdminForm = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const authInstance = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(db, 'users');
                const usersSnapshot = await getDocs(usersCollection);
                const userList = [];

                usersSnapshot.forEach((doc) => {
                    const userData = doc.data();
                    userList.push({
                        uid: doc.id,
                        email: userData.email,
                        role: userData.role,
                    });
                });

                setUsers(userList);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
        };

        const unsubscribe = onAuthStateChanged(authInstance, (user) => {
            if (user) {
                fetchUsers();
            }
        });

        return () => {
            unsubscribe();
        };
    }, [authInstance, db]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>Registered Users</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.uid}>
                        {user.email} - Role: {user.role}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminForm;
