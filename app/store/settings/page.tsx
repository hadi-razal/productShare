"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SettingsPage = () => {
    const [username, setUsername] = useState('');
    const [shopName, setShopName] = useState('');
    const [themeColor, setThemeColor] = useState('#000000');
    const [allowReviews, setAllowReviews] = useState(true);
    const [showFreeDeliveryIcon, setShowFreeDeliveryIcon] = useState(true);
    const [disableBuyNowBtn, setDisableBuyNowBtn] = useState(false);
    const [productCategories, setProductCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [gridView, setGridView] = useState(true);
    const [displayPrices, setDisplayPrices] = useState(true);
    const [displayRatings, setDisplayRatings] = useState(true);

    const handleSaveChanges = () => {
        console.log('Changes saved:', {
            username,
            shopName,
            themeColor,
            allowReviews,
            showFreeDeliveryIcon,
            disableBuyNowBtn,
            productCategories,
            gridView,
            displayPrices,
            displayRatings,
        });
    };

    const addCategory = () => {
        if (newCategory) {
            setProductCategories([...productCategories, newCategory]);
            setNewCategory('');
        }
    };

    return (
        <div className="min-h-screen px-4 pb-10 pt-24">
            <section className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-blue-950 mb-6">Store Settings</h2>

                {/* Username and Shop Name Sections */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Change Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-950"
                        placeholder="Enter new username"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Change Shop Name</label>
                    <input
                        type="text"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-950"
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

                {/* Display Settings */}
                {/* Allow Reviews, Free Delivery Icon, Disable Buy Now Button Toggles */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Catalog Display Options</label>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={displayPrices}
                            onChange={() => setDisplayPrices(!displayPrices)}
                            className="mr-2"
                        />
                        <span>Display Out of Stock Products</span>
                    </div>
                </div>
                <div className="mb-6 flex items-center">
                    <input
                        type="checkbox"
                        checked={allowReviews}
                        onChange={() => setAllowReviews(!allowReviews)}
                        className="mr-2"
                    />
                    <span>Enable users to add reviews</span>
                </div>
                <div className="mb-6 flex items-center">
                    <input
                        type="checkbox"
                        checked={showFreeDeliveryIcon}
                        onChange={() => setShowFreeDeliveryIcon(!showFreeDeliveryIcon)}
                        className="mr-2"
                    />
                    <span>Display free delivery icon on products</span>
                </div>
                <div className="mb-6 flex items-center">
                    <input
                        type="checkbox"
                        checked={disableBuyNowBtn}
                        onChange={() => setDisableBuyNowBtn(!disableBuyNowBtn)}
                        className="mr-2"
                    />
                    <span>Disable "Buy Now" button</span>
                </div>


                {/* Additional Notes Section */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Add Banner notification</label>
                    <textarea
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        placeholder="Any additional settings or notes"
                    ></textarea>
                </div>

                {/* Save Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveChanges}
                    className="w-full mt-4 px-4 py-2 bg-blue-950 text-white font-semibold rounded-md shadow-md hover:bg-blue-800"
                >
                    Save Changes
                </motion.button>
            </section>
        </div>
    );
};

export default SettingsPage;
