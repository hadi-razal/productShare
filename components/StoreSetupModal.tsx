"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiImage } from "react-icons/fi";
import {
  isUsernameAvailable,
  isValidUsername,
  normalizeUsername,
} from "@/helpers/username";
import { updateStore, type StoreRecord } from "@/lib/db";
import { uploadPublicFile } from "@/lib/storage";
import { storefrontDisplayHost } from "@/lib/storefront-url";
import {
  emitStoreSetupComplete,
  isValidOptionalWhatsapp,
  markOnboardingLocallyComplete,
  STORE_SETTINGS_PATH,
  storeWhatsappDigits,
} from "@/lib/store-profile";

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
  const [whatsappNumber, setWhatsappNumber] = useState(
    storeWhatsappDigits(store.whatsappNumber),
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
    if (!isValidOptionalWhatsapp(digits)) {
      toast.error("WhatsApp number must be 10–15 digits, or leave it blank.");
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
        <p className="ds-eyebrow">Welcome to your store</p>
        <h2 id="store-setup-title">Finish your catalog details</h2>
        <p className="ds-setup-lead">
          These details appear on your public catalog. Store name and username are required.
          WhatsApp is optional.
        </p>

        <div className="ds-form-group">
          <label className="ds-form-label">Store logo <span className="ds-optional">Optional</span></label>
          <div className="ds-setup-logo-row">
            <button
              type="button"
              className="ds-setup-logo"
              onClick={() => logoInputRef.current?.click()}
              aria-label="Upload store logo"
            >
              {previewLogoUrl ? (
                <Image
                  src={previewLogoUrl}
                  alt=""
                  width={64}
                  height={64}
                  unoptimized
                />
              ) : (
                <FiImage />
              )}
            </button>
            <div>
              <button
                type="button"
                className="ds-setup-logo-btn"
                onClick={() => logoInputRef.current?.click()}
              >
                {previewLogoUrl ? "Change logo" : "Upload logo"}
              </button>
              <p className="ds-form-hint">Shown on your catalog. Max 1MB.</p>
            </div>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              hidden
            />
          </div>
        </div>

        <div className="ds-form-group">
          <label className="ds-form-label" htmlFor="setup-store-name">
            Store name <span className="ds-required">Required</span>
          </label>
          <input
            id="setup-store-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="ds-form-input"
            placeholder="Your shop or brand name"
            autoComplete="organization"
          />
        </div>

        <div className="ds-form-group">
          <label className="ds-form-label" htmlFor="setup-username">
            Username <span className="ds-required">Required</span>
          </label>
          <input
            id="setup-username"
            type="text"
            value={username}
            onChange={(event) => setUsername(normalizeUsername(event.target.value))}
            className="ds-form-input"
            placeholder="yourstore"
            autoComplete="off"
          />
          <p className="ds-form-hint">
            Your catalog link: {storefrontDisplayHost(normalizeUsername(username) || "yourstore")}
          </p>
        </div>

        <div className="ds-form-group">
          <label className="ds-form-label" htmlFor="setup-whatsapp">
            WhatsApp number <span className="ds-optional">Optional</span>
          </label>
          <input
            id="setup-whatsapp"
            type="tel"
            inputMode="numeric"
            value={whatsappNumber}
            onChange={(event) => setWhatsappNumber(storeWhatsappDigits(event.target.value))}
            className="ds-form-input"
            placeholder="10–15 digits"
          />
          <p className="ds-form-hint">
            Customers can enquire from your catalog. Leave blank if you do not use WhatsApp.
          </p>
        </div>

        <div className="ds-form-group">
          <label className="ds-form-label" htmlFor="setup-notes">
            Catalog note <span className="ds-optional">Optional</span>
          </label>
          <textarea
            id="setup-notes"
            rows={3}
            value={additionalNotes}
            onChange={(event) => setAdditionalNotes(event.target.value)}
            className="ds-form-input resize-none"
            placeholder="A short welcome or promo on your catalog"
          />
        </div>

        <div className="ds-setup-actions">
          <button
            type="button"
            className="ds-btn-primary"
            onClick={() => void handleSave()}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save and continue"}
          </button>
          <button
            type="button"
            className="ds-setup-secondary"
            onClick={() => router.push(STORE_SETTINGS_PATH)}
            disabled={saving}
          >
            Open full settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreSetupModal;
