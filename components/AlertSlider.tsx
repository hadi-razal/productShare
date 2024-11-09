"use client";
import React, { useState } from "react";
import Marquee from "react-fast-marquee";
import { Tag, Gift, Sparkles, ShoppingBag, Truck, Star } from "lucide-react";

const AlertMessageSlider = () => {
    const promoMessages = [
        {
            icon: <Tag className="w-4 h-4" />,
            message: "LIMITED TIME OFFER: Get 30% OFF on all summer collections 🌞",
        },
        {
            icon: <Gift className="w-4 h-4" />,
            message: "Exclusive! Enjoy free shipping on all orders over $50 🚚",
        },
        {
            icon: <Sparkles className="w-4 h-4" />,
            message: "New Arrivals! Use code NEW10 for an extra 10% discount ✨",
        },
        {
            icon: <ShoppingBag className="w-4 h-4" />,
            message: "FLASH DEAL! Buy 1 Get 1 FREE on select items 🛍️",
        },
        {
            icon: <Truck className="w-4 h-4" />,
            message: "EXPRESS SHIPPING available on all orders! 🚀",
        },
        {
            icon: <Star className="w-4 h-4" />,
            message: "VIP Members: Earn double reward points this weekend ⭐",
        },
    ];

    return (
        <div className="relative  w-full group">
    

            {/* Main marquee content */}
            <div className="bg-red-600 w-full overflow-hidden">
                <Marquee
                    loop={0}
                    speed={50}
                    gradient={false}
                    className="py-2"
                >
                    <div className="flex gap-16">
                        {promoMessages.map((promo, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 text-white mx-8 group"
                            >
                                <span className="inline-flex items-center justify-center bg-white/20 rounded-full p-1.5 group-hover:bg-white/30 transition-all duration-300">
                                    {promo.icon}
                                </span>
                                <span className="text-sm font-medium tracking-wide">
                                    {promo.message}
                                </span>
                                <span className="text-white/60">|</span>
                            </div>
                        ))}
                    </div>
                </Marquee>
            </div>
        </div>
    );
};

export default AlertMessageSlider;
