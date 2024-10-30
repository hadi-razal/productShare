const Pricing = () => {
    return (
      <div className="flex items-center justify-center flex-col min-h-screen bg-gray-100 py-16">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-950">Simple Pricing</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl px-4">Choose the perfect plan for your business needs</p>
        
        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8 px-4">
          {/* Free Plan */}
          <div className="pricing-card bg-white p-8 shadow-lg rounded-lg max-w-xs w-full text-center transform transition-transform hover:scale-105">
            <div className="bg-gray-100 inline-block rounded-full px-4 py-1 mb-4">
              <span className="text-gray-950 text-sm font-medium">Free</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-950">Starter Plan</h3>
            <p className="text-gray-500 mb-4">Perfect for trying out our services</p>
            <div className="price mb-8">
              <span className="text-4xl font-bold text-gray-950">₹0</span>
              <span className="text-gray-500">/month</span>
            </div>
            <ul className="text-left space-y-3 mb-8">
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2 text-gray-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Basic Analytics
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2 text-gray-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Up to 10 Products
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2 text-gray-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Email Support
              </li>
            </ul>
            <button className="w-full bg-gray-100 text-gray-950 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
              Get Started Free
            </button>
          </div>
  
          {/* Basic Plan */}
          <div className="pricing-card bg-gray-950 p-8 shadow-lg rounded-lg max-w-xs w-full text-center transform transition-transform hover:scale-105 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">Popular</span>
            </div>
            <div className="bg-gray-800 inline-block rounded-full px-4 py-1 mb-4">
              <span className="text-white text-sm font-medium">Basic</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-white">Basic Plan</h3>
            <p className="text-gray-400 mb-4">For small businesses</p>
            <div className="price mb-8">
              <span className="text-4xl font-bold text-white">₹199</span>
              <span className="text-gray-400">/month</span>
            </div>
            <ul className="text-left space-y-3 mb-8">
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Advanced Analytics
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Up to 50 Products
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Priority Support
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Custom Domain
              </li>
            </ul>
            <button className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
              Choose Plan
            </button>
          </div>
  
          {/* Premium Plan */}
          <div className="pricing-card bg-white p-8 shadow-lg rounded-lg max-w-xs w-full text-center transform transition-transform hover:scale-105">
            <div className="bg-gray-100 inline-block rounded-full px-4 py-1 mb-4">
              <span className="text-gray-950 text-sm font-medium">Premium</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-950">Premium Plan</h3>
            <p className="text-gray-500 mb-4">For growing businesses</p>
            <div className="price mb-8">
              <span className="text-4xl font-bold text-gray-950">₹499</span>
              <span className="text-gray-500">/month</span>
            </div>
            <ul className="text-left space-y-3 mb-8">
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2 text-gray-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Advanced Analytics & Reports
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2 text-gray-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Unlimited Products
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2 text-gray-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                24/7 Premium Support
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2 text-gray-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Custom Domain
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2 text-gray-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                API Access
              </li>
            </ul>
            <button className="w-full bg-gray-950 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
              Choose Plan
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default Pricing;