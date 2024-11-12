"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, DocumentSnapshot, updateDoc } from "firebase/firestore";
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { userType } from '@/type';


const SettingsPage = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [themeColor, setThemeColor] = useState<string>('#000000');
    const [additionalNotes, setAdditionalNotes] = useState<string>('');

    const router = useRouter()

    useEffect(() => {
        onAuthStateChanged(auth, async (user: User | null) => {
            if (user) {
                setUserId(user.uid);
                await fetchUserData(user.uid);
            } else {
                setUserId(null);
            }
        });
    }, []);

    const fetchUserData = async (userId: string) => {
        try {
            const userDoc = doc(db, "users", userId);
            const docSnap: DocumentSnapshot = await getDoc(userDoc);
            if (docSnap.exists()) {
                const data: userType = docSnap.data() as userType;
                setUsername(data.username || '');
                setName(data.name || '');
                setEmail(data.email || '');
                setAdditionalNotes(data.additionalNotes || '');
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const handleSaveChanges = async () => {
        if (!userId) return;
        const userDoc = doc(db, "users", userId);

        try {
            await updateDoc(userDoc, {
                name,
                themeColor,
                additionalNotes
            });
            router.push('/store')
            console.log("Changes saved successfully");
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    };

    return (
        <div className="min-h-screen px-4 pb-10 pt-24">
            <section className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-blue-950 mb-6">Store Settings</h2>

                {/* Username and Shop Name Sections */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Username</label>
                    <input
                        type="text"
                        disabled
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="block w-full bg-gray-200 p-3 border focus:outline-none rounded-md"
                        placeholder="Enter new username"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Shop Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full bg-gray-200 p-3 border focus:outline-none rounded-md"
                        placeholder="Enter new shop name"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Email</label>
                    <input
                        type="text"
                        value={email}
                        disabled
                        className="block w-full bg-gray-200 p-3 border focus:outline-none rounded-md"
                        placeholder="Enter new shop name"
                    />
                </div>

                {/* Theme Color Picker */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Theme Color</label>
                    <input
                        type="color"
                        value={themeColor}
                        onChange={(e) => setThemeColor(e.target.value)}
                        className="w-full h-10 rounded-md border border-gray-300"
                    />
                </div>


                {/* Additional Notes Section */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Additional Notes</label>
                    <textarea
                        rows={3}
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        placeholder="Any additional settings or notes"
                    ></textarea>
                </div>

                {/* Save Button */}
                <motion.button
                    onClick={handleSaveChanges}
                    className="w-full mt-4 px-4 py-2 bg-blue-950 text-white font-semibold rounded-md shadow-md hover:bg-blue-900"
                >
                    Save Changes
                </motion.button>
            </section>
        </div>
    );
};

export default SettingsPage;
