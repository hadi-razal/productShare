"use client";

import { useEffect } from "react";
import { FiMail, FiTrash2, FiX } from "react-icons/fi";
import type { ContactMessageRecord } from "@/lib/db";

type MessageViewModalProps = {
  message: ContactMessageRecord;
  title: string;
  meta: { label: string; value: string }[];
  onClose: () => void;
  onDelete: () => void;
};

export default function MessageViewModal({ message, title, meta, onClose, onDelete }: MessageViewModalProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="ds-catalog-modal" onClick={onClose}>
      <div
        className="ds-message-view"
        role="dialog"
        aria-modal="true"
        aria-labelledby="message-view-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header>
          <strong id="message-view-title">{title}</strong>
          <button type="button" className="ds-admin-icon" onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </header>
        <dl>
          {meta
            .filter((item) => item.value)
            .map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
        </dl>
        <p className="ds-message-view-body">{message.message || "No message."}</p>
        <div>
          <button type="button" className="ds-catalog-btn-danger" onClick={onDelete}>
            <FiTrash2 /> Delete
          </button>
          {message.email ? (
            <a href={`mailto:${message.email}`} className="ds-catalog-btn-primary">
              <FiMail /> Reply by email
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
