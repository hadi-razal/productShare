"use client";
import React, { useState } from "react";
import Marquee from "react-fast-marquee";
import { Tag, Gift, Sparkles, ShoppingBag, Truck, Star } from "lucide-react";

const AlertMessageSlider = () => {
    const promoMessages = [
        {
            message: "LIMITED TIME OFFER: Get 30% OFF on all summer collections 🌞",
        }
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
                                <span className="text-sm font-medium tracking-wide">
                                    {promo.message}
                                </span>
                            </div>
                        ))}
                    </div>
                </Marquee>
            </div>
        </div>
    );
};

export default AlertMessageSlider;
