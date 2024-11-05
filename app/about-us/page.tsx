import Image from 'next/image';
import React from 'react';

const AboutUs = () => {
  return (
    <section className="py-16 px-6 text-gray-800 flex items-center justify-center flex-col bg-gray-100 pt-24">
      <div className="max-w-7xl flex items-center justify-center flex-col mx-auto text-center">

        {/* About Us Header */}
        <div className="mb-10 opacity-100 transform transition-all duration-1000">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900">
            About Product Share
          </h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-700">
            Product Share is a revolutionary SaaS platform that simplifies product management and collaboration. Founded by developer and entrepreneur Hadi Razal, it aims to transform how teams handle the entire product lifecycle.
          </p>
        </div>

        {/* Founder Section */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between w-full">
          <div className="w-full md:w-1/2 text-left mb-8 md:mb-0">
            <div className="opacity-100 transform transition-all duration-1000">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                Meet the Founder: Hadi Razal
              </h2>
              <p className="text-lg mb-6 text-gray-700">
                Hadi Razal, a full-stack developer and product enthusiast, created Product Share after identifying common challenges in product development workflows. With years of experience in development and team leadership, Hadi designed Product Share to streamline collaboration and enhance productivity in product teams worldwide.
              </p>
              <p className="text-lg text-gray-700">
                His mission is to make Product Share the go-to platform for seamless product management, empowering teams to focus on innovation without being hindered by complex workflows.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <Image
              src="/no.jpg"
              unoptimized={true}
              width={290}
              height={290}
              alt="Hadi Razal"
              className="rounded-full shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Vision Section */}
        <div className="mt-16">
          <div className="opacity-100 transform transition-all duration-1000">
            <h2 className="text-2xl font-semibold text-blue-900 mb-6">
              Our Vision
            </h2>
            <p className="text-lg max-w-3xl mx-auto mb-10 text-gray-700">
              Product Share envisions a future where every product team can collaborate effortlessly and drive innovation. We aim to revolutionize how teams work together on products, providing intuitive tools that make product management accessible, efficient, and engaging.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
};

export default AboutUs;
