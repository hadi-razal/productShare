"use client";

import { useState } from "react";
import Link from "next/link";
import { FiChevronDown } from "react-icons/fi";
import { homeFaqs } from "@/lib/seo";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-[1440px] px-3 py-20 sm:px-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
        FAQ
      </p>
      <h2 className="mt-3 text-[26px] font-bold uppercase tracking-tight text-slate-900 md:text-[32px]">
        Common questions
      </h2>

      <div className="mt-10 max-w-3xl divide-y divide-primary/15 border-y border-primary/15">
        {homeFaqs.map((faq, index) => {
          const open = openIndex === index;
          return (
            <div key={faq.question}>
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : index)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left"
                aria-expanded={open}
              >
                <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-slate-900">
                  {faq.question}
                </span>
                <FiChevronDown
                  className={`h-4 w-4 flex-shrink-0 text-primary transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open && (
                <p className="pb-5 text-sm leading-relaxed text-neutral-600">
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <Link
        href="/faq"
        className="mt-8 inline-flex text-[12px] font-medium uppercase tracking-[0.16em] text-primary hover:underline"
      >
        View all questions
      </Link>
    </section>
  );
}
