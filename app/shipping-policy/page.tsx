import type { Metadata } from "next";
import React from 'react';

export const metadata: Metadata = {
  title: "Shipping Policy — Product Share India",
  description:
    "Product Share India is a fully digital service — no physical shipping involved. Access your catalog builder instantly from anywhere in the world after purchase.",
  keywords: ["Product Share shipping policy", "digital service delivery India", "no shipping catalog builder"],
  alternates: { canonical: "https://productshare.in/shipping-policy" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Shipping Policy — Product Share India",
    description: "Product Share India is a 100% digital service. Access your catalog instantly — no shipping required.",
    url: "https://productshare.in/shipping-policy",
    type: "website",
  },
};

const ShippingPolicy = () => {
  return (
    <div className='mx-auto max-w-6xl py-24 px-3'>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Shipping Policy</h2>
      <p>
        At Product Share, we strive to provide a seamless experience for our customers who create and showcase their online stores. As our service focuses on digital storefronts and catalogue building, there are no physical products shipped. Instead, we provide easy-to-use tools for creating your personalized online store and managing your product listings.
      </p>

      <h3>International Access</h3>
      <p>
        Our platform is accessible globally, allowing store owners and online sellers to create and manage their digital stores from anywhere in the world. There are no shipping or delivery fees involved as the service is entirely digital.
      </p>

      <h3>Domestic Access</h3>
      <p>
        Product Share is designed to serve users locally as well as internationally. Whether you are based in the same country as our platform or elsewhere, you can access all the features of our catalogue builder seamlessly. Our service is available without any physical shipping constraints.
      </p>

      <h3>Product Listing Updates</h3>
      <p>
        As an online store owner, you can add, update, or remove your products at any time through our easy-to-use catalogue builder. These changes are immediately reflected on your online storefront, making it easy to manage your inventory digitally.
      </p>

      <h3>Customer Support</h3>
      <p>
        For any questions or assistance regarding your account, store setup, or any issues with managing your online catalogue, please reach out to our customer support team. We are here to help you:
      </p>
      <ul>
        <li>Phone: 9074063723</li>
        <li>Email: <a href="mailto:hadhirasal22@gmail.com">hadhirasal22@gmail.com</a></li>
      </ul>

      <h3>Digital Services and Platform Accessibility</h3>
      <p>
        We ensure that the digital services we offer are available around the clock. However, please note that Product Share is not responsible for any internet connectivity issues or technical difficulties that may arise on the user's end. Access to the platform and management of your store is dependent on your own internet service provider.
      </p>
    </div>
  );
};

export default ShippingPolicy;
