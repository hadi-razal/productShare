import Image from 'next/image';
import React from 'react';
import Head from 'next/head';

const AboutUs = () => {
  return (
    <>
      <Head>
        <title>About Product Share - Revolutionizing Product Management</title>
        <meta name="description" content="Product Share is a revolutionary SaaS platform that simplifies product management and collaboration, founded by Hadi Razal to enhance team productivity." />
        <meta name="keywords" content="SaaS, product management, collaboration, product lifecycle, innovation, teamwork, Hadi Razal" />
        <meta name="author" content="Hadi Razal" />
      </Head>
      
      <section className="py-16 px-6 text-gray-800 flex items-center justify-center flex-col bg-gray-100 pt-24">
        <div className="max-w-7xl flex items-center justify-center flex-col mx-auto text-center">

          {/* About Us Header */}
          <div className="mb-10 opacity-100 transform transition-all duration-1000">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900">
              About Product Share
            </h1>
            <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-700">
              Product Share is a revolutionary SaaS platform that simplifies product management and collaboration. Founded by developer and entrepreneur Hadi Razal, it aims to transform how teams handle the entire product lifecycle, fostering innovation, enhancing productivity, and streamlining processes.
            </p>
          </div>

          {/* Product Features Section */}
          <div className="mt-16 max-w-4xl mx-auto text-left">
            <h2 className="text-2xl font-semibold text-blue-900 mb-6">Product Features</h2>
            <ul className="list-disc pl-5 text-lg text-gray-700">
              <li>Collaborative workspace for product teams</li>
              <li>Real-time updates and seamless communication</li>
              <li>Efficient product lifecycle tracking from idea to launch</li>
              <li>Intuitive tools that make product management accessible</li>
              <li>Customizable workflows for teams of any size</li>
              <li>Secure cloud-based platform with robust data protection</li>
            </ul>
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
                  His mission is to make Product Share the go-to platform for seamless product management, empowering teams to focus on innovation without being hindered by complex workflows. Hadi’s expertise ensures that the platform evolves with industry trends and user needs, offering a scalable and adaptable solution.
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <Image
                src="/no.jpg"
                unoptimized={true}
                width={290}
                height={290}
                alt="Hadi Razal, Founder of Product Share"
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

          {/* Achievements Section */}
          <div className="mt-16 max-w-4xl mx-auto text-left">
            <h2 className="text-2xl font-semibold text-blue-900 mb-6">Our Achievements</h2>
            <p className="text-lg text-gray-700 mb-6">
              Since its inception, Product Share has garnered positive feedback from early adopters, empowering product teams across various industries to improve their workflows and enhance their productivity. We are proud to be recognized by leading industry experts as a top-tier product management tool.
            </p>
            <p className="text-lg text-gray-700">
              Our platform is trusted by over 500 product teams, and we are continuously improving and adding new features based on user feedback. As we grow, our vision remains clear: to simplify product management and make it universally accessible.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
