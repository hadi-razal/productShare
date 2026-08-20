"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { onAuthChange } from "@/lib/auth";
import { getStoreById, submitStoreMessage } from "@/lib/db";

const TOPICS = [
  { value: "suggestion", label: "Suggestion" },
  { value: "support", label: "Support" },
  { value: "feature", label: "Feature request" },
  { value: "other", label: "Other" },
] as const;

export default function StoreMessagePage() {
  const [storeId, setStoreId] = useState("");
  const [storeName, setStoreName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<(typeof TOPICS)[number]["value"]>("suggestion");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsub = onAuthChange(async (user) => {
      if (!user) return;
      setStoreId(user.uid);
      setEmail(user.email || "");
      try {
        const store = await getStoreById(user.uid);
        setStoreName(store?.name || store?.username || "");
        setName(store?.name || user.displayName || "");
        setEmail(store?.email || user.email || "");
      } catch {
        setName(user.displayName || "");
      }
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await submitStoreMessage({
        name,
        email,
        message,
        topic,
        storeId,
        storeName,
      });
      toast.success("Message sent to ProductShare.");
      setMessage("");
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Could not send message. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ds-page ds-settings">
      <section className="ds-card" style={{ maxWidth: 560 }}>
        <h2 className="ds-catalog-title">Send a message to ProductShare</h2>

        <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
          <div className="ds-form-group">
            <label className="ds-form-label" htmlFor="store-message-name">Your name</label>
            <input
              id="store-message-name"
              className="ds-form-input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="ds-form-group">
            <label className="ds-form-label" htmlFor="store-message-email">Email</label>
            <input
              id="store-message-email"
              className="ds-form-input"
              type="email"
              value={email}
              disabled
            />
            <p className="ds-form-hint">We reply to the email on your store account.</p>
          </div>

          <div className="ds-form-group">
            <label className="ds-form-label" htmlFor="store-message-topic">Topic</label>
            <select
              id="store-message-topic"
              className="ds-form-input"
              value={topic}
              onChange={(event) => setTopic(event.target.value as typeof topic)}
            >
              {TOPICS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="ds-form-group">
            <label className="ds-form-label" htmlFor="store-message-body">Message</label>
            <textarea
              id="store-message-body"
              className="ds-form-input resize-none"
              rows={6}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Tell us what you need, or share a suggestion."
              required
            />
          </div>

          <button type="submit" className="ds-btn-primary" disabled={submitting}>
            {submitting ? "Sending..." : "Send message"}
          </button>
        </form>
      </section>
    </div>
  );
}
