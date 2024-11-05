import React from 'react';

const AboutUs = () => {
  return (
    <section className= "py-16 px-6 text-gray-800 pt-24">
      <div className="max-w-7xl mx-auto text-center">
        
        {/* About Us Header */}
        <div className="mb-10 opacity-100 transform translate-y-0 transition-all duration-1000">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900">
            About Product Share
          </h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            Product Share is a revolutionary SaaS platform that simplifies product management and collaboration, created by developer and entrepreneur Hadi Razal to transform how teams handle their product lifecycle.
          </p>
        </div>
        
        {/* Founder Section */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between md:space-x-10">
          <div className="w-full md:w-1/2 text-left">
            <div className="opacity-100 transform translate-x-0 transition-all duration-1000">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                Created by Hadi Razal
              </h2>
              <p className="text-lg mb-6">
                Hadi Razal, a full-stack developer and product enthusiast, created Product Share after identifying common challenges in product development workflows. With experience in both development and team leadership, Hadi designed Product Share to streamline collaboration and enhance productivity in product teams.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center opacity-100 transform translate-x-0 transition-all duration-1000">
            <img 
              src="/hadi-razal.jpg" 
              alt="Hadi Razal" 
              className="w-[300px] h-[300px] rounded-full shadow-lg object-cover"
            />
          </div>
        </div>
        
        {/* Our Mission Section */}
        <div className="mt-16">
          <div className="opacity-100 transform translate-y-0 transition-all duration-1000">
            <h2 className="text-2xl font-semibold text-blue-900 mb-6">
              Our Vision
            </h2>
            <p className="text-lg max-w-3xl mx-auto mb-10">
              Product Share aims to revolutionize how teams collaborate on products by providing intuitive tools that make product management accessible to everyone. We believe that great products come from seamless collaboration and clear communication.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;