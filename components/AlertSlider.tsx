"use client";

import React, { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams } from "next/navigation";
import { getUserId } from "@/helpers/getUserId";

const AlertMessageSlider = () => {
    const { storeId } = useParams();
    const [promoMessage, setPromoMessage] = useState<string>('');

    useEffect(() => {
        const fetchPromoMessages = async () => {
            try {
                const userId = await getUserId(storeId as string);
                const userRef = doc(db, "users", userId);
                const userDocSnap = await getDoc(userRef);
                const user = userDocSnap.data()
                setPromoMessage(user.additionalNotes);
            } catch (error) {
                console.error("Error fetching promo messages: ", error);
            }
        };

        fetchPromoMessages();
    }, [storeId]);

    return (
        <div className="relative w-full group">
            <div className="bg-red-600 w-full overflow-hidden">
                <Marquee loop={0} speed={50} gradient={false} className="py-2 max-w-7xl mx-auto">
                    <div className="flex gap-16">
                        <div
                            className="flex items-center gap-3 text-white mx-8 group"
                        >
                            <span className="text-sm font-medium tracking-wide">
                                {promoMessage}
                            </span>
                        </div>
                    </div>
                </Marquee>
            </div>
        </div>
    );
};

export default AlertMessageSlider;
