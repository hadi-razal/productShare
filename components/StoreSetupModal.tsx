"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiImage } from "react-icons/fi";
import { SITE_HOST } from "@/lib/storefront-url";
import {
  isUsernameAvailable,
  isValidUsername,
  normalizeUsername,
} from "@/helpers/username";
import { updateStore, type StoreRecord } from "@/lib/db";
import { uploadPublicFile } from "@/lib/storage";
import {
  emitStoreSetupComplete,
  markOnboardingLocallyComplete,
  STORE_SETTINGS_PATH,
  storeWhatsappDigits,
} from "@/lib/store-profile";
import { normalizeWhatsappNumber, whatsappValidationMessage } from "@/lib/whatsapp";
import WhatsAppNumberField from "@/components/WhatsAppNumberField";

type StoreSetupModalProps = {
  userId: string;
  store: StoreRecord;
  onComplete: (store: Partial<StoreRecord>) => void;
};

const StoreSetupModal = ({ userId, store, onComplete }: StoreSetupModalProps) => {
  const router = useRouter();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(store.name || "");
  const [username, setUsername] = useState(store.username || "");
  const [whatsappNumber, setWhatsappNumber] = useState(() =>
    normalizeWhatsappNumber(store.whatsappNumber),
  );
  const [additionalNotes, setAdditionalNotes] = useState(store.additionalNotes || "");
  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [logoImageUrl, setLogoImageUrl] = useState<string | null>(store.logoImage || null);
  const [saving, setSaving] = useState(false);

  const previewLogoUrl = useMemo(() => {
    if (logoImage) return URL.createObjectURL(logoImage);
    return logoImageUrl;
  }, [logoImage, logoImageUrl]);

  useEffect(() => {
    if (!logoImage || !previewLogoUrl) return;
    return () => URL.revokeObjectURL(previewLogoUrl);
  }, [logoImage, previewLogoUrl]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      toast.error("Logo must be under 1MB.");
      event.target.value = "";
      return;
    }
    setLogoImage(file);
  };

  const handleSave = async () => {
    const trimmedName = name.trim();
    const normalizedUsername = normalizeUsername(username);
    const digits = storeWhatsappDigits(whatsappNumber);

    if (!trimmedName) {
      toast.error("Store name is required.");
      return;
    }
    if (!isValidUsername(normalizedUsername)) {
      toast.error("Username must be 3–30 characters, letters and numbers only.");
      return;
    }
    const whatsappError = whatsappValidationMessage(digits);
    if (whatsappError) {
      toast.error(whatsappError);
      return;
    }
    if (normalizedUsername !== store.username) {
      const available = await isUsernameAvailable(normalizedUsername, userId);
      if (!available) {
        toast.error("This username is already taken.");
        return;
      }
    }

    setSaving(true);
    try {
      const updated: Partial<StoreRecord> = {
        name: trimmedName,
        username: normalizedUsername,
        whatsappNumber: digits,
        additionalNotes: additionalNotes.trim(),
        onboardingCompleted: true,
      };

      if (logoImage) {
        const ts = new Date().toISOString().replace(/[:.]/g, "-");
        const safeName = logoImage.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        updated.logoImage = await uploadPublicFile(
          `images/logo_${userId}_${ts}_${safeName}`,
          logoImage,
        );
      }

      await updateStore(userId, updated);
      markOnboardingLocallyComplete(userId);
      emitStoreSetupComplete({ id: userId, ...updated });
      toast.success("Store details saved.");
      onComplete(updated);
    } catch (error) {
      console.error("Error saving store setup:", error);
      toast.error("Could not save your store details. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ds-setup-overlay" role="presentation">
      <div
        className="ds-setup-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="store-setup-title"
      >
        <header className="ds-setup-head">
          <p>Welcome</p>
          <h2 id="store-setup-title">Set up your catalog</h2>
          <p>Your name, catalog address, and WhatsApp appear on the public page.</p>
        </header>

        <div className="ds-setup-body">
          <div className="ds-setup-identity">
            <button
              type="button"
              className="ds-setup-logo"
              onClick={() => logoInputRef.current?.click()}
              aria-label={previewLogoUrl ? "Change store logo" : "Upload store logo"}
            >
              {previewLogoUrl ? (
                <Image src={previewLogoUrl} alt="" width={72} height={72} unoptimized />
              ) : (
                <FiImage />
              )}
              <span>{previewLogoUrl ? "Change" : "Logo"}</span>
            </button>
            <div className="ds-setup-field">
              <label htmlFor="setup-store-name">Store name</label>
              <input
                id="setup-store-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your shop or brand"
                autoComplete="organization"
              />
            </div>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              hidden
            />
          </div>

          <div className="ds-setup-field">
            <label htmlFor="setup-username">Catalog address</label>
            <div className="ds-setup-url">
              <input
                id="setup-username"
                type="text"
                value={username}
                onChange={(event) => setUsername(normalizeUsername(event.target.value))}
                placeholder="yourstore"
                autoComplete="off"
                spellCheck={false}
              />
              <span>.{SITE_HOST}</span>
            </div>
          </div>

          <div className="ds-setup-field">
            <label htmlFor="setup-whatsapp">WhatsApp</label>
            <WhatsAppNumberField
              id="setup-whatsapp"
              value={whatsappNumber}
              onChange={setWhatsappNumber}
              variant="setup"
            />
          </div>

          <div className="ds-setup-optional">
            <p>Optional</p>
            <div className="ds-setup-field">
              <label htmlFor="setup-notes">Note on your catalog</label>
              <textarea
                id="setup-notes"
                rows={2}
                value={additionalNotes}
                onChange={(event) => setAdditionalNotes(event.target.value)}
                placeholder="A short welcome or promo"
              />
            </div>
          </div>
        </div>

        <footer className="ds-setup-actions">
          <button
            type="button"
            className="ds-setup-secondary"
            onClick={() => router.push(STORE_SETTINGS_PATH)}
            disabled={saving}
          >
            More settings
          </button>
          <button
            type="button"
            className="ds-setup-primary"
            onClick={() => void handleSave()}
            disabled={saving}
          >
            {saving ? "Saving..." : "Continue"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default StoreSetupModal;
