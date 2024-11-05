"use client";

const premiumPlan = {
  name: "Premium Plan",
  price: "₹99",
  duration: "/month",
  features: [
    "Advanced Analytics & Reports",
    "Unlimited Products",
    "24/7 Premium Support",
    "Custom Theme",
    "Custom Logo",
  ],
  buttonText: "Buy Premium",
  description: "For growing businesses looking to maximize their reach and efficiency.",
};

const BuyPremium = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-100 via-gray-100 to-blue-50 py-16 pt-24 px-6">
      <h2 className="text-4xl font-extrabold text-center mb-6 text-gray-900">Upgrade to Premium</h2>
      <p className="text-lg text-gray-600 text-center mb-8 max-w-2xl">
        Unlock powerful features to boost your business and provide a better experience for your customers.
      </p>
      
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg text-center">
        <div className="mb-6">
          <h3 className="text-3xl font-semibold text-gray-800">{premiumPlan.name}</h3>
          <div className="flex justify-center items-baseline my-4">
            <span className="text-5xl font-bold text-gray-900">{premiumPlan.price}</span>
            <span className="text-xl text-gray-500 ml-2">{premiumPlan.duration}</span>
          </div>
        </div>

        <h4 className="text-lg font-semibold text-gray-700 mb-4">Features Included:</h4>
        <ul className="space-y-3 text-left text-gray-700">
          {premiumPlan.features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-2">
              <svg
                className="w-6 h-6 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span className="hover:text-blue-600 transition-colors">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          className="mt-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-8 py-3 rounded-full font-semibold transition-transform transform hover:scale-105 shadow-md"
          onClick={() => alert("Premium plan purchased successfully!")}
        >
          {premiumPlan.buttonText}
        </button>
      </div>
    </div>
  );
};

export default BuyPremium;
