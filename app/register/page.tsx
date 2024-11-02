"use client"

import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const router = useRouter()
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            router.push('/dashboard');
          }
        });
        return () => unsubscribe();
      }, [router]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Add user details to Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name,
                username,
                email,
            });

            console.log('Account created successfully:', user);
        } catch (error) {
            console.error('Error creating account:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="rounded-md p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-slate-950 text-center mb-6">Register Your Account</h2>
                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-950 mb-2" htmlFor="name">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="block w-full bg-gray-300 p-3 border border-gray-600 rounded-md"
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
                            className="block w-full bg-gray-300 p-3 border border-gray-600 rounded-md"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-950 mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="block w-full bg-gray-300 p-3 border border-gray-600 rounded-md"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-950 mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="block w-full bg-gray-300 p-3 border border-gray-600 rounded-md"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="flex items-center justify-center w-full px-6 py-3 rounded-md text-base font-medium transition-all duration-300 bg-slate-950 hover:bg-slate-800 text-white shadow-lg"
                    >
                        Register
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-700">
                        Have an account?{' '}
                        <Link href="/login" className="text-slate-950 hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
