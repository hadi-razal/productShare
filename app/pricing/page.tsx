const plans = [
  {
    id: 1,
    name: "Free Plan",
    price: "₹0",
    duration: "/month",
    features: ["Basic Analytics", "Up to 2 Products", "Email Support"],
    buttonText: "Get Started Free",
    bgColor: "bg-white",
    popular: false,
    label: "Free",
    description: "Perfect for trying out our services",
  },
  {
    id: 2,
    name: "Premium Plan",
    price: "₹199",
    duration: "/month",
    features: [
      "Advanced Analytics & Reports",
      "Unlimited Products",
      "24/7 Premium Support",
    ],
    buttonText: "Choose Plan",
    bgColor: "bg-gray-950",
    popular: true,
    label: "Premium",
    description: "For growing businesses",
  },
];

const Pricing = () => {
  return (
    <div className="flex items-center justify-center flex-col min-h-screen bg-gray-100 py-16 pt-40">
      <h2 className="text-4xl font-bold text-center mb-4 text-gray-950">Simple Pricing</h2>
      <p className="text-gray-600 text-center mb-12 max-w-2xl px-4">
        Choose the perfect plan for your business needs
      </p>
      
      <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8 px-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`pricing-card ${plan.bgColor} p-8 shadow-lg rounded-md max-w-xs w-full text-center transform transition-transform relative`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">Popular</span>
              </div>
            )}
            <div className={`${plan.popular ? "bg-gray-800" : "bg-gray-100"} inline-block rounded-full px-4 py-1 mb-4`}>
              <span className={`${plan.popular ? "text-white" : "text-gray-950"} text-sm font-medium`}>
                {plan.label}
              </span>
            </div>
            <h3 className={`${plan.popular ? "text-white" : "text-gray-950"} text-2xl font-semibold mb-4`}>
              {plan.name}
            </h3>
            <p className={`${plan.popular ? "text-gray-400" : "text-gray-500"} mb-4`}>{plan.description}</p>
            <div className="price mb-8">
              <span className={`${plan.popular ? "text-white" : "text-gray-950"} text-4xl font-bold`}>{plan.price}</span>
              <span className={`${plan.popular ? "text-gray-400" : "text-gray-500"}`}>{plan.duration}</span>
            </div>
            <ul className="text-left space-y-3 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className={`${plan.popular ? "text-gray-300" : "text-gray-600"} flex items-center`}>
                  <svg className={`w-5 h-5 mr-2 ${plan.popular ? "text-blue-500" : "text-gray-950"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button className="w-full bg-gray-950 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors">
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
