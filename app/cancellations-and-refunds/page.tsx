import React from 'react';

const Page = () => {
  return (
    <div style={{ padding: '5px',paddingTop:'90px', lineHeight: '1.6' }}>
      <h2>Cancellation Policy</h2>
      <p>
        Product Share is committed to providing a seamless experience for our customers, and we aim to make the process of cancellations as convenient as possible. Below are the details of our cancellation policy:
      </p>
      <ul>
        <li><strong>Cancellation Window:</strong> Cancellation requests will only be considered if made within 1-2 days of placing the order.</li>
        <li><strong>Orders in Process:</strong> Once an order has been communicated to the vendor or merchant and the shipping process has begun, cancellation requests will generally not be entertained.</li>
        <li><strong>Non-Cancellable Items:</strong> Cancellation requests for perishable items such as flowers, eatables, and similar products will not be accepted.</li>
        <li><strong>Refunds & Replacements:</strong> If the product received is damaged or of poor quality, a refund or replacement may be provided after investigation. Please report such issues to our Customer Service Team within 1-2 days of receiving the product.</li>
        <li><strong>Wrong Product Received:</strong> If the product received differs from what was displayed on our site or does not meet your expectations, please contact our Customer Service Team within 1-2 days of receiving the item.</li>
        <li><strong>Warranty Claims:</strong> For products with a manufacturer's warranty, please directly contact the manufacturer for any related concerns or claims.</li>
        <li><strong>Refund Processing:</strong> Approved refunds will be processed within 1-2 days and credited back to the customers original payment method.</li>
      </ul>
      <p>
        For any further questions or assistance, please don’t hesitate to reach out to our Customer Service Team. We are here to help!
      </p>
    </div>
  );
};

export default Page;
