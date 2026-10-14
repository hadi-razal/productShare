"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Native modal semantics provide focus trapping, Escape, and focus restoration. */
export default function WorkspaceDialog({ children, label, onClose, busy = false }: { children: ReactNode; label: string; onClose: () => void; busy?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return <dialog ref={ref} className="ps-modal" aria-label={label} onCancel={(event) => { event.preventDefault(); if (!busy) onClose(); }} onClick={(event) => { if (event.target === event.currentTarget && !busy) onClose(); }}><div className="ps-modal-body">{children}</div></dialog>;
}
