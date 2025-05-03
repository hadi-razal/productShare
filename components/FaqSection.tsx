"use client"

import React, { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

const faqs = [
  {
    question: "What is Product Share?",
    answer: (
      <div>
        <p className="text-base text-gray-800 font-medium">
          <strong>Empower Your Business in Minutes</strong><br />
          Product Share helps small business owners create and share product catalogs online — without a website.
        </p>
        <ul className="list-disc pl-5 mt-2 text-sm text-gray-700 space-y-1">
          <li>No coding</li>
          <li>No website needed</li>
          <li>Just your products, beautifully shared</li>
        </ul>
      </div>
    )
  },
  {
    question: "How Does It Work?",
    answer: (
      <div>
        <p className="text-base text-gray-800 font-medium">
          <strong>From Products to Public in 3 Steps</strong>
        </p>
        <ol className="list-decimal pl-5 mt-2 text-sm text-gray-700 space-y-1">
          <li>Add your products</li>
          <li>Customize your catalog</li>
          <li>Share the link anywhere</li>
        </ol>
      </div>
    )
  },
  {
    question: "Who Is It For?",
    answer: (
      <div>
        <p className="text-base text-gray-800 font-medium">
          <strong>Built for Small Hustlers</strong>
        </p>
        <ul className="list-disc pl-5 mt-2 text-sm text-gray-700 space-y-1">
          <li>Instagram sellers</li>
          <li>Home-based businesses</li>
          <li>Local shop owners</li>
        </ul>
      </div>
    )
  },
  {
    question: "How Can I Get Started?",
    answer: (
      <div>
        <p className="text-base text-gray-800 font-medium mb-2">
          <strong>Create Your Free Account Now</strong><br />
          Join small business owners already using Product Share.
        </p>
        <a
          href="/register"
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          👉 Register Now
        </a>
      </div>
    )
  }
]

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-10 px-4 md:px-10">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-800 mb-8">
          Product Share – FAQ
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-left"
              >
                <span className="text-base font-medium text-gray-800">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-4 h-4 text-blue-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-blue-600" />
                )}
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mt-3 text-sm"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
