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

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<ContactMessageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ContactMessageRecord | null>(null);

  const load = async () => {
    const rows = await listContactMessages("website");
    setMessages(rows);
  };

  useEffect(() => {
    const run = async () => {
      try {
        await load();
      } catch (error) {
        console.error(error);
        toast.error("Could not load contact enquiries.");
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
      [item.name, item.email, item.message].join(" ").toLowerCase().includes(term),
    );
  }, [messages, search]);

  const removeMessage = async () => {
    if (!confirmDelete) return;
    setBusyId(confirmDelete.id);
    try {
      await deleteContactMessage(confirmDelete.id);
      setMessages((current) => current.filter((item) => item.id !== confirmDelete.id));
      setConfirmDelete(null);
      toast.success("Enquiry deleted.");
    } catch (error) {
      console.error(error);
      toast.error("Could not delete enquiry.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="ds-page ds-catalog">
      <div className="ds-catalog-header">
        <div className="ds-catalog-heading">
          <h2 className="ds-catalog-title">Contact enquiries</h2>
          <p>
            {loading
              ? "Loading messages from the website contact form."
              : `${filtered.length} ${filtered.length === 1 ? "enquiry" : "enquiries"} shown. One row per email.`}
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
              placeholder="Search name, email, message"
              aria-label="Search enquiries"
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
          <div className="ds-admin-table ds-contacts-table">
            <div className="ds-admin-head">
              <span>Name</span>
              <span>Email</span>
              <span>Message</span>
              <span>Updated</span>
              <span>Actions</span>
            </div>
            {loading ? (
              [0, 1, 2, 3, 4].map((item) => (
                <div key={item} className="ds-admin-row ds-catalog-skeleton">
                  <span /><span /><span /><span /><span />
                </div>
              ))
            ) : filtered.length ? (
              filtered.map((item) => (
                <div key={item.id} className="ds-admin-row">
                  <span>
                    <strong>{item.name || "—"}</strong>
                  </span>
                  <span className="ds-admin-contact">{item.email || "—"}</span>
                  <span className="ds-contacts-message" title={item.message}>
                    {item.message || "—"}
                  </span>
                  <span>
                    {formatDate(item.updatedAt)}
                    {item.createdAt && item.updatedAt && item.createdAt !== item.updatedAt ? (
                      <small className="ds-contacts-first">First: {formatDate(item.createdAt)}</small>
                    ) : null}
                  </span>
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
                      aria-label={`Delete enquiry from ${item.email}`}
                    >
                      <FiTrash2 />
                    </button>
                  </span>
                </div>
              ))
            ) : (
              <div className="ds-catalog-empty">
                <strong>No enquiries yet</strong>
                <p>Messages from the public contact form will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {confirmDelete && (
        <div className="ds-catalog-modal" onClick={() => busyId !== confirmDelete.id && setConfirmDelete(null)}>
          <div onClick={(event) => event.stopPropagation()}>
            <strong>Delete enquiry from {confirmDelete.email}?</strong>
            <p>This removes the contact message. They can submit again with the same email.</p>
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
