"use client"

import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ModalProps'; // Assuming you have a Modal component

const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user?.emailVerified) {
                router.push('/store');
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Send email verification
            await sendEmailVerification(user);

            // Add user details to Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name,
                username,
                whatsappNumber,
                email,
                premiumUser: false,
                emailVerified: false
            });

            console.log('Account created successfully:', user);
            setShowVerificationModal(true);
        } catch (error: any) {
            console.error('Error creating account:', error);
            setError(error.message || 'An error occurred during registration.');
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setShowVerificationModal(false);
        // Optionally sign out the user since they need to verify email first
        auth.signOut();
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="rounded-md p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-slate-950 text-center mb-6">Register Your Account</h2>
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}
                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-950 mb-2" htmlFor="name">
                            Store Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="block w-full  bg-gray-200 p-3 border focus:outline-none   rounded-md"
                            placeholder="Enter your full name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-950 mb-2" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="block w-full bg-gray-200 p-3 border focus:outline-none   rounded-md"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-950 mb-2" htmlFor="username">
                            Store Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="block w-full  bg-gray-200 p-3 border focus:outline-none   rounded-md"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-950 mb-2" htmlFor="WhatsappNumber">
                            Whatsapp Number
                        </label>
                        <input
                            type="number"
                            id="WhatsappNumber"
                            value={whatsappNumber}
                            onChange={(e) => setWhatsappNumber(e.target.value)}
                            required
                            className="block w-full  bg-gray-200 p-3 border focus:outline-none   rounded-md"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slat-950 mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="block w-full  bg-gray-200 p-3 border focus:outline-none rounded-md"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`flex items-center justify-center w-full px-6 py-3 rounded-md text-base font-medium transition-all duration-300 ${loading ? 'bg-gray-400' : 'bg-primaryColor hover:bg-primaryColor/90'} text-white shadow-lg`}
                    >
                        {loading ? 'Registering...' : 'Register'}
                        {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-700">
                        Have an account?{' '}
                        <Link href="/login" className="text-blue-950 hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>

            {/* Verification Modal */}
            {showVerificationModal && (
                <Modal onClose={closeModal}>
                    <div className="p-6 text-center">
                        <h3 className="text-xl font-bold mb-4">Verify Your Email</h3>
                        <p className="mb-4">
                            A verification link has been sent to <span className="font-semibold">{email}</span>.
                            Please check your email and click the link to verify your account.
                        </p>
                        <p className="mb-4 text-sm text-gray-600">
                            Didn't receive the email? Check your spam folder or try registering again.
                        </p>
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-primaryColor/90"
                        >
                            OK
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default RegisterPage;