'use client'; // Only if using Next.js App Router

import React, { useState } from 'react';

const faqs = [
  {
    question: " What is Product Share?",
    answer: (
      <div>
        <p className="text-lg">
          <strong>Empower Your Business in Minutes</strong><br />
          Product Share is an easy-to-use platform that helps small business owners create and share product catalogs online — without needing a website.
        </p>
        <ul className="list-disc pl-6 mt-3 space-y-1">
          <li> No coding.</li>
          <li> No website needed.</li>
          <li> Just your products, beautifully shared.</li>
        </ul>
      </div>
    ),
  },
  {
    question: " How Does It Work?",
    answer: (
      <div>
        <p className="text-lg">
          <strong>From Products to Public in 3 Simple Steps</strong>
        </p>
        <ol className="list-decimal pl-6 mt-3 space-y-1">
          <li><strong>Add Your Products</strong> – Upload names, prices, images, and descriptions.</li>
          <li><strong>Customize Your Catalog</strong> – Choose layouts and colors that match your brand.</li>
          <li><strong>Share the Link</strong> – Get a unique link to share on WhatsApp, Instagram, or anywhere online.</li>
        </ol>
        <p className="mt-2"> Your catalog becomes your mini-website.</p>
      </div>
    ),
  },
  {
    question: " Who Is It For?",
    answer: (
      <div>
        <p className="text-lg">
          <strong>Built for Small Hustlers & Side Business Owners</strong>
        </p>
        <ul className="list-disc pl-6 mt-3 space-y-1">
          <li> Instagram sellers</li>
          <li> Home-based businesses</li>
          <li> Local shop owners</li>
          <li> Women entrepreneurs</li>
        </ul>
        <p className="mt-2">Start small. Think big. Share smart.</p>
      </div>
    ),
  },
  {
    question: " How Can I Get Started?",
    answer: (
      <div>
        <p className="text-lg mb-4">
          <strong>Create Your Free Account Now</strong><br />
          Join hundreds of small business owners already using Product Share.
        </p>
        <a
          href="/register"
          className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          👉 Register Now
        </a>
        <p className="mt-2">No setup fees. No technical skills needed. Just register and start sharing.</p>
      </div>
    ),
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-auto bg-white px-4  md:px-16 lg:px-32 text-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center text-blue-700">Product Share – FAQ</h1>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border rounded-lg p-4 shadow">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left flex justify-between items-center text-xl font-semibold"
              >
                <span>{faq.question}</span>
                <span>{openIndex === index ? '−' : '+'}</span>
              </button>
              {openIndex === index && (
                <div className="mt-4 text-gray-700 text-base">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
