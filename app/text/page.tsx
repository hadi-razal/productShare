import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "Test",
    description: "Founded by Hadi Razal, ProductShare helps small business owners create and share product catalogs easily with customers.",
    keywords: "ProductShare, Hadi Razal, product catalog, small business app, product sharing, online catalog, Hadi Razal CEO",
    openGraph: {
        title: "ProductShare by Hadi Razal - Showcase Your Products",
        description: "Founded by Hadi Razal, ProductShare is designed for small businesses to easily share product catalogs.",
        url: "https://yourwebsite.com",  // Replace with your actual URL
        type: "website",
        images: [
            {
                url: "https://yourwebsite.com/image.jpg",  // Replace with an actual image URL
                width: 800,
                height: 600,
                alt: "ProductShare - Showcase Your Products",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "ProductShare by Hadi Razal - Showcase Your Products",
        description: "ProductShare, founded by Hadi Razal, allows easy catalog sharing for small business owners.",
        creator: "@Hadi_Razal",
    },
    robots: "index, follow",
};

const page = () => {


    return (
        <div>page</div>
    )
}

export default page