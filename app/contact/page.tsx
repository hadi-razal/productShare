"use client";

import React, { useState } from "react";
import { siteConfig } from "@/lib/site";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const subject = `Website enquiry from ${formData.name}`;
    const body = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      "",
      formData.message,
    ].join("\n");

    window.location.href = `mailto:${siteConfig.supportEmail}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  const fieldClass =
    "w-full border-0 border-b border-neutral-200 bg-transparent px-0 py-3 text-sm text-black placeholder:text-neutral-400 outline-none focus:border-primary focus:ring-0";

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_rgba(108,100,203,0.12),_transparent_42%)] pb-20 pt-24">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-3 sm:px-5 lg:grid-cols-2 lg:gap-20 lg:pt-8">
        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
            Contact
          </p>
          <h1 className="mt-3 text-[28px] font-bold uppercase leading-tight tracking-tight text-slate-900 md:text-[36px]">
            Talk to the team
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-600">
            Support, pricing, onboarding, or partnerships. We usually reply during
            business hours.
          </p>

          <div className="mt-10 divide-y divide-primary/15 border-y border-primary/15">
            <a
              href={`mailto:${siteConfig.supportEmail}`}
              className="flex items-baseline justify-between gap-6 py-5 hover:text-primary"
            >
              <span className="text-[11px] uppercase tracking-[0.16em] text-primary/70">
                Email
              </span>
              <span className="text-sm text-slate-900">{siteConfig.supportEmail}</span>
            </a>
            <a
              href={`tel:${siteConfig.supportPhoneHref}`}
              className="flex items-baseline justify-between gap-6 py-5 hover:text-primary"
            >
              <span className="text-[11px] uppercase tracking-[0.16em] text-primary/70">
                Phone
              </span>
              <span className="text-sm text-slate-900">{siteConfig.supportPhone}</span>
            </a>
            <a
              href={`https://wa.me/${siteConfig.supportWhatsAppNumber}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-baseline justify-between gap-6 py-5 hover:text-primary"
            >
              <span className="text-[11px] uppercase tracking-[0.16em] text-primary/70">
                WhatsApp
              </span>
              <span className="text-sm text-slate-900">{siteConfig.supportPhone}</span>
            </a>
          </div>

          <p className="mt-6 text-[11px] uppercase tracking-[0.16em] text-neutral-400">
            {siteConfig.supportHours}
          </p>
        </section>

        <section>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
            Message
          </p>
          <h2 className="mt-3 text-[22px] font-bold uppercase tracking-tight text-slate-900">
            Send an enquiry
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            This opens your email app with the message ready to send.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-[11px] uppercase tracking-[0.16em] text-neutral-500"
              >
                Full name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={fieldClass}
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-[11px] uppercase tracking-[0.16em] text-neutral-500"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={fieldClass}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-1 block text-[11px] uppercase tracking-[0.16em] text-neutral-500"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className={`${fieldClass} resize-none`}
                placeholder="How can we help?"
                required
              />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center bg-primary py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-white hover:bg-primary/90"
            >
              Compose email
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;
