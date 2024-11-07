import { FC } from 'react';

const PrivacyPolicy: FC = () => {
  return (
    <section className="bg-white py-12 pt-24 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-blue-950 mb-8">Privacy Policy</h1>
        <div className="space-y-8 text-left max-w-3xl mx-auto">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-600">
              Welcome to Product Share's Privacy Policy. This policy explains how we collect, use, disclose, and safeguard your information when you use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information Collection</h2>
            <p className="text-gray-600">
              We may collect personal information that you provide to us directly, such as your name, email address, and payment information. We may also collect information about your device and browsing actions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Subscription Model and Trial Period</h2>
            <p className="text-gray-600">
              Our premium services are offered on a subscription basis at a rate of ₹99 per month. You may also take advantage of a 3-day free trial to experience the premium features before committing to the subscription. After the trial period, you will be charged ₹99 per month unless you cancel your subscription before the trial ends.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Use of Information</h2>
            <p className="text-gray-600">
              Your information is used to provide and improve our services, process transactions, send updates, and communicate with you about your account or service updates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Sharing of Information</h2>
            <p className="text-gray-600">
              We may share your information with third-party service providers, such as payment processors or data analytics partners, only to the extent necessary for them to perform their services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Security</h2>
            <p className="text-gray-600">
              We implement a variety of security measures to maintain the safety of your personal information, but please note that no method of transmission over the Internet is entirely secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
            <p className="text-gray-600">
              We retain your personal information only for as long as necessary to fulfill the purposes for which we collected it, including any legal or reporting requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Your Rights</h2>
            <p className="text-gray-600">
              You have rights regarding your personal data, such as the right to access, update, or delete the information we hold about you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to This Privacy Policy</h2>
            <p className="text-gray-600">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600">
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:hadhirasal22@gmail.com" className="text-blue-600 underline">hadhirasal22@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
