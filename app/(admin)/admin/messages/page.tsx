"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FiMail, FiSearch, FiTrash2, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  deleteContactMessage,
  listContactMessages,
  type ContactMessageRecord,
} from "@/lib/db";

const formatDate = (value: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const topicLabel = (topic: string) => {
  if (topic === "suggestion") return "Suggestion";
  if (topic === "support") return "Support";
  if (topic === "feature") return "Feature request";
  if (topic === "other") return "Other";
  return topic || "—";
};

export default function AdminStoreMessagesPage() {
  const [messages, setMessages] = useState<ContactMessageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ContactMessageRecord | null>(null);

  const load = async () => {
    const rows = await listContactMessages("store");
    setMessages(rows);
  };

  useEffect(() => {
    const run = async () => {
      try {
        await load();
      } catch (error) {
        console.error(error);
        toast.error("Could not load store messages.");
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return messages;
    return messages.filter((item) =>
      [item.name, item.email, item.message, item.storeName, item.topic]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [messages, search]);

  const removeMessage = async () => {
    if (!confirmDelete) return;
    setBusyId(confirmDelete.id);
    try {
      await deleteContactMessage(confirmDelete.id);
      setMessages((current) => current.filter((item) => item.id !== confirmDelete.id));
      setConfirmDelete(null);
      toast.success("Message deleted.");
    } catch (error) {
      console.error(error);
      toast.error("Could not delete message.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="ds-page ds-catalog">
      <div className="ds-catalog-header">
        <div className="ds-catalog-heading">
          <h2 className="ds-catalog-title">Store messages</h2>
          <p>
            {loading
              ? "Loading messages from store owners."
              : `${filtered.length} ${filtered.length === 1 ? "message" : "messages"} shown.`}
          </p>
        </div>
      </div>

      <section className="ds-catalog-card">
        <div className="ds-catalog-toolbar">
          <div className="ds-catalog-search">
            <FiSearch />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search store, email, topic, message"
              aria-label="Search store messages"
            />
            {search && (
              <button
                type="button"
                className="ds-catalog-search-clear"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <FiX />
              </button>
            )}
          </div>
        </div>

        <div className="ds-catalog-table-wrap">
          <div className="ds-admin-table ds-store-messages-table">
            <div className="ds-admin-head">
              <span>Store</span>
              <span>Topic</span>
              <span>Email</span>
              <span>Message</span>
              <span>Sent</span>
              <span>Actions</span>
            </div>
            {loading ? (
              [0, 1, 2, 3, 4].map((item) => (
                <div key={item} className="ds-admin-row ds-catalog-skeleton">
                  <span /><span /><span /><span /><span /><span />
                </div>
              ))
            ) : filtered.length ? (
              filtered.map((item) => (
                <div key={item.id} className="ds-admin-row">
                  <span>
                    <strong>{item.storeName || item.name || "—"}</strong>
                    {item.storeName && item.name && item.storeName !== item.name ? (
                      <small className="ds-contacts-first">{item.name}</small>
                    ) : null}
                  </span>
                  <span>{topicLabel(item.topic)}</span>
                  <span className="ds-admin-contact">{item.email || "—"}</span>
                  <span className="ds-contacts-message" title={item.message}>
                    {item.message || "—"}
                  </span>
                  <span>{formatDate(item.createdAt || item.updatedAt)}</span>
                  <span className="ds-admin-actions">
                    <a
                      href={`mailto:${item.email}`}
                      className="ds-admin-icon"
                      aria-label={`Email ${item.email}`}
                    >
                      <FiMail />
                    </a>
                    <button
                      type="button"
                      className="ds-admin-icon is-danger"
                      onClick={() => setConfirmDelete(item)}
                      aria-label={`Delete message from ${item.email}`}
                    >
                      <FiTrash2 />
                    </button>
                  </span>
                </div>
              ))
            ) : (
              <div className="ds-catalog-empty">
                <strong>No store messages yet</strong>
                <p>Messages sent from a store dashboard will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {confirmDelete && (
        <div className="ds-catalog-modal" onClick={() => busyId !== confirmDelete.id && setConfirmDelete(null)}>
          <div onClick={(event) => event.stopPropagation()}>
            <strong>Delete message from {confirmDelete.email}?</strong>
            <p>This removes the store message from the admin list.</p>
            <div>
              <button
                type="button"
                className="ds-catalog-btn"
                onClick={() => setConfirmDelete(null)}
                disabled={busyId === confirmDelete.id}
              >
                Cancel
              </button>
              <button
                type="button"
                className="ds-catalog-btn-danger"
                onClick={() => void removeMessage()}
                disabled={busyId === confirmDelete.id}
              >
                {busyId === confirmDelete.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
