import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const FilterModal = ({ isOpen, onClose }: any) => {
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [categories, setCategories] = useState('');
    const [isFreeDelivery, setIsFreeDelivery] = useState(false);
    const [isMostSelling, setIsMostSelling] = useState(false);
    const [isOnSale, setIsOnSale] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white max-w-3xl mx-auto rounded-lg w-11/12 md:w-2/3 p-8 shadow-lg relative animate-fadeIn">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                    aria-label="Close Modal"
                >
                    <FiX />
                </button>

                {/* Modal Title */}
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Filter Products</h2>

                {/* Price Range */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Price Range</label>
                    <div className="flex space-x-3">
                        <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="Min Price"
                            className="border  rounded-md p-2 w-full focus:outline-none "
                        />
                        <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="Max Price"
                            className="border rounded-md p-2 w-full focus:outline-none "
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Categories</label>
                    <input
                        type="text"
                        value={categories}
                        onChange={(e) => setCategories(e.target.value)}
                        placeholder="Search categories"
                        className="border border-gray-300 rounded-md p-2 w-full  focus:outline-none"
                    />
                </div>

                {/* Filters */}
                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Additional Filters</h3>
                    <div className="space-y-3">
                        <label className="flex items-center text-gray-700">
                            <input
                                type="checkbox"
                                checked={isFreeDelivery}
                                onChange={() => setIsFreeDelivery(!isFreeDelivery)}
                                className="mr-3 h-4 w-4 text-blue-500 focus:ring-blue-500"
                            />
                            Free Delivery
                        </label>
                        <label className="flex items-center text-gray-700">
                            <input
                                type="checkbox"
                                checked={isMostSelling}
                                onChange={() => setIsMostSelling(!isMostSelling)}
                                className="mr-3 h-4 w-4 text-blue-500 focus:ring-blue-500"
                            />
                            Most Selling Products
                        </label>
                        <label className="flex items-center text-gray-700">
                            <input
                                type="checkbox"
                                checked={isOnSale}
                                onChange={() => setIsOnSale(!isOnSale)}
                                className="mr-3 h-4 w-4 text-blue-500 focus:ring-blue-500"
                            />
                            On Sale Products
                        </label>

                    </div>
                </div>

                {/* Apply & Reset Buttons */}
                <div className="flex justify-end space-x-4 mt-8">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-md text-gray-700 border border-gray-300 hover:bg-gray-100 transition"
                    >
                        Reset
                    </button>
                    <button
                        onClick={() => {
                            // Add apply filter logic here
                            onClose();
                        }}
                        className="px-5 py-2 rounded-md text-white bg-blue-950 hover:bg-blue-900 transition shadow-md"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;
