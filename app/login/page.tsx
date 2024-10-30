"use client"

import React, { useState } from 'react';
import {  signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/fireabse';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';


const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Logged In Successfully", userCredential.user);
        } catch (error) {
            console.error("Login failed:", error);
            setError("Invalid email or password. Please try again.");
        }
        
        console.log('Logging in with:', { email, password });
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="rounded-md p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-slate-950 text-center mb-6">Login to Your Account</h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    {error && <p className="text-red-500 text-center">{error}</p>}
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
                        Login
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-700">
                        Don't have an account?{' '}
                        <Link href={'/login'} className="text-slate-950 hover:underline">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
