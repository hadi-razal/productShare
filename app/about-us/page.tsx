import React from "react";
import Head from "next/head";
import {
  Target,
  Layers,
  Users,
  Trophy,
  Globe,
  Lock,
} from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description }: any) => (
  <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
    <div className="bg-gradient-to-tr from-indigo-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-indigo-700" />
    </div>
    <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-sm md:text-base text-gray-600">{description}</p>
  </div>
);

const AboutUs = () => {
  const features = [
    {
      icon: Layers,
      title: "Collaborative Workspace",
      description:
        "A unified platform where product teams can seamlessly collaborate and manage their workflows.",
    },
    {
      icon: Users,
      title: "Team Communication",
      description:
        "Real-time updates and integrated communication tools to keep everyone aligned.",
    },
    {
      icon: Target,
      title: "Product Lifecycle Tracking",
      description:
        "Intuitive tracking from initial concept to final product launch and beyond.",
    },
    {
      icon: Globe,
      title: "Scalable Solutions",
      description:
        "Customizable workflows that adapt to teams of any size and industry.",
    },
    {
      icon: Lock,
      title: "Robust Security",
      description:
        "Enterprise-grade security and data protection to keep your innovative ideas safe.",
    },
    {
      icon: Trophy,
      title: "Continuous Innovation",
      description:
        "Constant improvements based on user feedback and cutting-edge product management research.",
    },
  ];

  return (
    <>
      <Head>
        <title>About Product Share - Revolutionizing Product Management</title>
        <meta
          name="description"
          content="Product Share is a revolutionary SaaS platform that simplifies product management and collaboration, enhancing team productivity and streamlining workflows."
        />
        <meta
          name="keywords"
          content="SaaS, product management, collaboration, product lifecycle, innovation, teamwork"
        />
        <meta name="author" content="Product Share" />
      </Head>

      <div className="bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen pb-16 pt-8">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <section className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
              About Product Share
            </h1>
            <p className="max-w-3xl mx-auto text-base md:text-lg text-gray-700 leading-relaxed">
              We're transforming product management with an innovative SaaS platform designed
              to simplify collaboration, enhance productivity, and streamline the entire
              product lifecycle.
            </p>
          </section>

          {/* Features Grid */}
          <section className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
              Our Core Features
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </section>

          {/* Vision Section */}
          <section className="bg-white/80 backdrop-blur-md rounded-2xl px-6 py-12 shadow-md max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Visionary Mission
            </h2>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              Product Share envisions a world where product teams can collaborate without
              friction. We're committed to creating tools that make product management
              intuitive, efficient, and genuinely enjoyable for teams of all sizes and
              industries.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
