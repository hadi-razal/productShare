"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const NotFoundPage = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
            <div className="bg-white p-8 md:p-12 rounded-md max-w-2xl mx-auto text-center">
                {/* 404 Message */}
                <h1 className="text-8xl md:text-9xl font-bold text-gray-800">
                    404
                </h1>

                {/* Message */}
                <p className="text-xl text-gray-600 mt-4">
                    Oops! The page you are looking for doesnt exist.
                </p>

                <p className="text-lg text-gray-500 mt-2">
                    It seems you have stumbled upon a missing page.
                </p>

                {/* Interactive button */}
                <button
                    onClick={() => router.push('/')}
                    className="mt-8 px-8 py-4 bg-blue-950 text-white rounded-lg font-medium hover:bg-blue-900 transition-all duration-300"
                >
                    Go Back to Home
                </button>
            </div>
        </div>
    );
};

export default NotFoundPage;
