"use client";

import React, { useState } from "react";
import { FiMail, FiMessageCircle, FiPhone } from "react-icons/fi";
import { siteConfig } from "@/lib/site";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_45%),linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] px-4 py-16">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-3xl bg-slate-950 p-8 text-white shadow-xl md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-300">
            Contact Product Share
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight">
            Talk to the team behind your catalog website.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
            Reach out for support, pricing questions, onboarding help, or
            partnership enquiries. We usually respond during business hours.
          </p>

          <div className="mt-8 space-y-4">
            <a
              href={`mailto:${siteConfig.supportEmail}`}
              className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 transition hover:border-slate-700"
            >
              <FiMail className="mt-1 h-5 w-5 text-indigo-300" />
              <div>
                <p className="text-sm font-semibold text-white">Email support</p>
                <p className="mt-1 text-sm text-slate-300">
                  {siteConfig.supportEmail}
                </p>
              </div>
            </a>

            <a
              href={`tel:${siteConfig.supportPhoneHref}`}
              className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 transition hover:border-slate-700"
            >
              <FiPhone className="mt-1 h-5 w-5 text-indigo-300" />
              <div>
                <p className="text-sm font-semibold text-white">Call us</p>
                <p className="mt-1 text-sm text-slate-300">
                  {siteConfig.supportPhone}
                </p>
              </div>
            </a>

            <a
              href={`https://wa.me/${siteConfig.supportWhatsAppNumber}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 transition hover:border-slate-700"
            >
              <FiMessageCircle className="mt-1 h-5 w-5 text-indigo-300" />
              <div>
                <p className="text-sm font-semibold text-white">WhatsApp</p>
                <p className="mt-1 text-sm text-slate-300">
                  Chat with the team for a quick response
                </p>
              </div>
            </a>
          </div>

          <p className="mt-8 text-xs uppercase tracking-[0.22em] text-slate-500">
            {siteConfig.supportHours}
          </p>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg md:p-10">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold text-slate-900">Send a message</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This form opens your email app with everything pre-filled so you can
              send us a message right away.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                placeholder="Tell us what you need help with."
                required
              />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              Compose Email
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;
