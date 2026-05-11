"use client";

import React from "react";
import { motion } from "framer-motion";

// Demo data array
const demoReviews = [
  {
    id: "1",
    productId: "p101",
    productName: "Organic Green Cardamom",
    rating: 5,
    comment: "Absolutely loved the aroma and quality. Will reorder!",
    userName: "Anjali R.",
    createdAt: "2025-05-01",
  },
  {
    id: "2",
    productId: "p102",
    productName: "Premium Black Cardamom",
    rating: 4,
    comment: "Good quality but packaging can be improved.",
    userName: "Mohammed S.",
    createdAt: "2025-05-02",
  },
  {
    id: "3",
    productId: "p103",
    productName: "Dry Ginger Powder",
    rating: 3,
    comment: "Average taste, expected better freshness.",
    userName: "Priya K.",
    createdAt: "2025-05-03",
  },
  {
    id: "4",
    productId: "p104",
    productName: "Clove Special Pack",
    rating: 5,
    comment: "Strong and fresh cloves. Great for masala tea!",
    userName: "Rahul N.",
    createdAt: "2025-05-03",
  },
];

const CustomerReviewsPage: React.FC = () => {
  return (
    <div className="min-h-screen px-4 pb-10 pt-7 bg-gray-50">
      <section className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-950 mb-6">Customer Reviews</h2>

        {demoReviews.length === 0 ? (
          <p className="text-gray-500">No reviews available for your products yet.</p>
        ) : (
          <div className="space-y-6">
            {demoReviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-xl p-5 bg-white shadow-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-blue-800">{review.productName}</h4>
                  <span className="text-sm text-gray-500">{review.createdAt}</span>
                </div>
                <div className="text-yellow-500 text-sm mb-2">
                  {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
                </div>
                <p className="text-gray-800 italic">"{review.comment}"</p>
                <p className="text-sm text-gray-500 mt-2">— {review.userName}</p>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CustomerReviewsPage;
