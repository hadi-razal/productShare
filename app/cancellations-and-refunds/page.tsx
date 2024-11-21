import React from 'react';

const Page = () => {
  return (
    <div className='mx-auto max-w-6xl py-24'>
     <h2 className="text-3xl font-bold text-gray-800 mb-4">Cancellation Policy</h2>
      <p>
        Product Share is committed to providing a seamless experience for our customers, offering a digital catalogue builder to manage online stores. Below are the details of our cancellation policy:
      </p>
      <ul>
        <li><strong>Cancellation Window:</strong> Cancellation requests will only be considered within 1-2 days of purchasing or subscribing to our service.</li>
        <li><strong>Non-refundable Items:</strong> As our service involves providing access to the online catalogue builder, we do not accept cancellations for services that have already been used to create a digital storefront.</li>
        <li><strong>Subscription Service:</strong> If you have subscribed to our premium features, you may cancel the subscription at any time, but no refunds will be provided for any time already used.</li>
        <li><strong>Service Issues:</strong> If you encounter any technical issues, such as problems with accessing or using the catalogue builder, please contact our Customer Service Team within 1-2 days of the issue.</li>
        <li><strong>Product Listing Issues:</strong> If you experience issues with the products you have listed on your store, such as discrepancies between your listing and the live store, contact us within 1-2 days, and we will work to resolve them.</li>
        <li><strong>Refund Processing:</strong> In cases where a refund is deemed appropriate for an issue related to our service (such as technical failures preventing access to your store), the refund will be processed within 1-2 days and credited back to the payment method used during the purchase.</li>
      </ul>
      <p>
        If you have any further questions or need assistance, please don't hesitate to reach out to our Customer Service Team. We are here to help!
      </p>
    </div>
  );
};

export default Page;
