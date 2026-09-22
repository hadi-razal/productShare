"use client";

import { FiStar } from "react-icons/fi";

const CustomerReviewsPage = () => {
  return (
    <div className="ds-page ds-catalog">
      <div className="ds-catalog-header">
        <div className="ds-catalog-heading">
          <h2 className="ds-catalog-title">Reviews</h2>
        </div>
      </div>

      <section className="ds-card ds-reviews-empty">
        <FiStar aria-hidden="true" />
        <h3>No reviews yet</h3>
        <p>Reviews for your products will come here.</p>
      </section>
    </div>
  );
};

export default CustomerReviewsPage;
