"use client"

import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

interface Product {
    regularPrice: number;
    discountPrice?: number;
    freeDelivery?: boolean;
    mostSelling?: boolean;
    onSale?: boolean;
}

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, products, setProducts }) => {
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [isFreeDelivery, setIsFreeDelivery] = useState(false);
    const [isMostSelling, setIsMostSelling] = useState(false);
    const [isOnSale, setIsOnSale] = useState(false);

    if (!isOpen) return null;

    const applyFilters = () => {
        const filteredProducts = products.filter((product) => {
            const price = product.discountPrice ?? product.regularPrice;
            const matchesPriceRange =
                (!minPrice || price >= parseFloat(minPrice)) &&
                (!maxPrice || price <= parseFloat(maxPrice));
            const matchesFreeDelivery = !isFreeDelivery || product.freeDelivery;
            const matchesMostSelling = !isMostSelling || product.mostSelling;
            const matchesOnSale = !isOnSale || product.onSale;

            return matchesPriceRange && matchesFreeDelivery && matchesMostSelling && matchesOnSale;
        });

        setProducts(filteredProducts);
        onClose();
    };

    const resetFilters = () => {
        setMinPrice('');
        setMaxPrice('');
        setIsFreeDelivery(false);
        setIsMostSelling(false);
        setIsOnSale(false);
        setProducts(products);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white max-w-3xl mx-auto rounded-lg w-11/12 md:w-2/3 p-8 shadow-lg relative animate-fadeIn">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl">
                    <FiX />
                </button>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Filter Products</h2>
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Price Range</label>
                    <div className="flex space-x-3">
                        <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="Min Price"
                            className="border rounded-md p-2 w-full"
                        />
                        <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="Max Price"
                            className="border rounded-md p-2 w-full"
                        />
                    </div>
                </div>
                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Additional Filters</h3>
                    <div className="space-y-3">
                        <label className="flex items-center text-gray-700">
                            <input type="checkbox" checked={isFreeDelivery} onChange={() => setIsFreeDelivery(!isFreeDelivery)} className="mr-3 h-4 w-4" />
                            Free Delivery
                        </label>
                        <label className="flex items-center text-gray-700">
                            <input type="checkbox" checked={isMostSelling} onChange={() => setIsMostSelling(!isMostSelling)} className="mr-3 h-4 w-4" />
                            Most Selling Products
                        </label>
                        <label className="flex items-center text-gray-700">
                            <input type="checkbox" checked={isOnSale} onChange={() => setIsOnSale(!isOnSale)} className="mr-3 h-4 w-4" />
                            On Sale Products
                        </label>
                    </div>
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                    <button onClick={resetFilters} className="px-5 py-2 text-gray-700 border border-gray-300">Reset</button>
                    <button onClick={applyFilters} className="px-5 py-2 text-white bg-blue-950">Apply Filters</button>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;
