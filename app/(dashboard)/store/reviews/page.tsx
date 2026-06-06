"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiMessageSquare } from "react-icons/fi";

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
    <div className="ds-page">
      <section className="max-w-3xl">
        {demoReviews.length === 0 ? (
          <div className="ds-card" style={{ textAlign: "center", padding: "40px 24px" }}>
            <FiMessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="ds-card-title">No reviews yet</h3>
            <p style={{ fontSize: 14, color: "#64748b", marginTop: 8 }}>
              Customer reviews will appear here once you start receiving them.
            </p>
          </div>
        ) : (
          <div className="ds-review-list">
            {demoReviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="ds-review-card"
              >
                <div className="ds-review-top">
                  <h4 className="ds-review-product">{review.productName}</h4>
                  <span className="ds-review-date">{review.createdAt}</span>
                </div>
                <div className="ds-review-stars">
                  {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
                </div>
                <p className="ds-review-comment">&ldquo;{review.comment}&rdquo;</p>
                <p className="ds-review-author">— {review.userName}</p>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CustomerReviewsPage;
