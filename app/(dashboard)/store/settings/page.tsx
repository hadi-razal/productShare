"use client";

import React, {
  useState,
  useEffect,
  ChangeEvent,
  useMemo,
  useRef,
} from "react";
import { motion } from "framer-motion";
import { onAuthChange } from "@/lib/auth";
import { uploadPublicFile } from "@/lib/storage";
import { getStoreById, updateStore } from "@/lib/db";
import { useRouter } from "next/navigation";
import { userType } from "@/type";
import toast from "react-hot-toast";
import StoreSettingsPreview from "@/components/StoreSettingsPreview";
import {
  isUsernameAvailable,
  isValidUsername,
  normalizeUsername,
} from "@/helpers/username";
import { FiCheck, FiEye, FiEyeOff, FiPlus, FiX } from "react-icons/fi";
import {
  emitStoreThemeChange,
  normalizeStoreTheme,
  STORE_THEMES,
  STORE_THEME_MAP,
  type StoreThemeId,
} from "@/lib/store-themes";
import {
  addCustomCategory,
  DEFAULT_PRODUCT_CATEGORIES,
  removeCustomCategory,
} from "@/lib/product-categories";
import {
  isStoreProfileComplete,
  missingStoreProfileFields,
  storeProfileIncompleteMessage,
} from "@/lib/store-profile";

const SettingsPage: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [originalUsername, setOriginalUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");
  const [storeTheme, setStoreTheme] = useState<StoreThemeId>("minimal");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [logoImageUrl, setLogoImageUrl] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<string>("");
  const [isOffline, setIsOffline] = useState(false);
  const [visibilitySaving, setVisibilitySaving] = useState(false);
  const [productCategories, setProductCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [categorySaving, setCategorySaving] = useState(false);
  const [savedProfileComplete, setSavedProfileComplete] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        setUserId(user.uid);
        await fetchUserData(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      const data = await getStoreById(userId);
      if (data) {
        setUsername(data.username || "");
        setOriginalUsername(data.username || "");
        setName(data.name || "");
        setEmail(data.email || "");
        setWhatsappNumber(data?.whatsappNumber || "");
        setAdditionalNotes(data?.additionalNotes || "");
        setLogoImageUrl(data?.logoImage || null);
        setStoreTheme(normalizeStoreTheme(data?.storeTheme));
        setIsOffline(Boolean(data?.isOffline));
        setProductCategories(data?.productCategories ?? []);
        setSavedProfileComplete(isStoreProfileComplete(data));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data.");
    }
  };

  const handleSaveChanges = async () => {
    if (!userId) return;

    if (!name.trim()) {
      toast.error("Store name is required.");
      return;
    }

    if (!/^\d{10}$/.test(whatsappNumber)) {
      toast.error("WhatsApp Number must be 10 digits.");
      return;
    }

    const normalizedUsername = normalizeUsername(username);

    if (!isValidUsername(normalizedUsername)) {
      toast.error(
        "Username must be 3–30 characters, letters and numbers only.",
      );
      return;
    }

    if (normalizedUsername !== originalUsername) {
      const available = await isUsernameAvailable(normalizedUsername, userId);
      if (!available) {
        toast.error("This username is already taken.");
        return;
      }
    }

    if (logoImage && logoImage.size > 1024 * 1024) {
      toast.error("Logo must be under 1MB.");
      return;
    }

    setLoading(true);

    try {
      const updatedData: Partial<userType> = {
        name,
        username: normalizedUsername,
        themeColor: STORE_THEME_MAP[storeTheme].accent,
        storeTheme,
        additionalNotes,
        whatsappNumber,
        isOffline,
        productCategories,
      };

      if (logoImage) {
        try {
          const ts = new Date().toISOString().replace(/[:.]/g, "-");
          const safeName = logoImage.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          updatedData.logoImage = await uploadPublicFile(
            `images/logo_${userId}_${ts}_${safeName}`,
            logoImage,
          );
        } catch (uploadError) {
          console.error("Error uploading logo:", uploadError);
          toast.error("Failed to upload logo. Please try again.");
          return;
        }
      }

      await updateStore(userId, updatedData);
      if (updatedData.logoImage) {
        setLogoImageUrl(updatedData.logoImage);
        setLogoImage(null);
        if (logoInputRef.current) logoInputRef.current.value = "";
      }
      setOriginalUsername(normalizedUsername);
      setUsername(normalizedUsername);
      setSavedProfileComplete(true);
      emitStoreThemeChange(storeTheme);
      toast.success("Changes saved successfully!");
      router.push("/store");
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  const persistCategories = async (next: string[]) => {
    if (!userId) return;
    setCategorySaving(true);
    try {
      await updateStore(userId, { productCategories: next });
      setProductCategories(next);
    } catch (error) {
      console.error("Error saving categories:", error);
      toast.error("Could not save category.");
    } finally {
      setCategorySaving(false);
    }
  };

  const handleAddCategory = async () => {
    if (!savedProfileComplete) {
      toast.error(
        storeProfileIncompleteMessage({ username, name, whatsappNumber }) ||
          "Save your username, store name, and WhatsApp number first.",
      );
      return;
    }
    const next = addCustomCategory(productCategories, newCategory);
    if (next.length === productCategories.length) {
      toast.error("Enter a unique category name.");
      return;
    }
    await persistCategories(next);
    setNewCategory("");
  };

  const handleRemoveCategory = async (name: string) => {
    await persistCategories(removeCustomCategory(productCategories, name));
  };

  const handleProfilePicChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast.error("Logo must be under 1MB.");
      event.target.value = "";
      return;
    }

    setLogoImage(file);
  };

  const handleVisibilityToggle = async () => {
    if (!userId || visibilitySaving) return;
    const next = !isOffline;
    setIsOffline(next);
    setVisibilitySaving(true);
    try {
      await updateStore(userId, { isOffline: next });
      toast.success(next ? "Your store is now offline." : "Your store is live again.");
    } catch (error) {
      console.error("Error updating store visibility:", error);
      setIsOffline(!next);
      toast.error("Could not update store visibility.");
    } finally {
      setVisibilitySaving(false);
    }
  };

  const previewLogoUrl = useMemo(() => {
    if (logoImage) return URL.createObjectURL(logoImage);
    return logoImageUrl;
  }, [logoImage, logoImageUrl]);

  const missingFields = missingStoreProfileFields({ username, name, whatsappNumber });

  useEffect(() => {
    if (!logoImage || !previewLogoUrl) return;
    return () => URL.revokeObjectURL(previewLogoUrl);
  }, [logoImage, previewLogoUrl]);

  return (
    <div className="ds-page ds-settings">
      {missingFields.length > 0 && (
        <div className="ds-profile-banner" role="status">
          <p>
            <strong>Complete your store profile.</strong> Username, store name, and WhatsApp number must be saved before you can create products or categories.
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
        <section className="ds-card min-w-0">
          <div className="ds-form-group">
            <label className="ds-form-label">Store Logo</label>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="ds-form-input"
            />
            <p className="ds-form-hint">Displayed in your store header. Max 1MB.</p>
          </div>

          {[
            {
              label: "Username",
              value: username,
              onChange: (value: string) => setUsername(normalizeUsername(value)),
              disabled: false,
              hint: "3–30 characters, letters and numbers only. Must be unique.",
            },
            { label: "Email", value: email, disabled: true },
            { label: "Store name", value: name, onChange: setName },
            {
              label: "WhatsApp Number",
              value: whatsappNumber,
              onChange: setWhatsappNumber,
              hint: "10-digit number for customer inquiries.",
            },
          ].map((field, index) => (
            <div key={index} className="ds-form-group">
              <label className="ds-form-label">{field.label}</label>
              <input
                type="text"
                value={field.value}
                onChange={
                  field.onChange
                    ? (e) => field.onChange!(e.target.value)
                    : undefined
                }
                className="ds-form-input"
                disabled={field.disabled}
              />
              {"hint" in field && field.hint && (
                <p className="ds-form-hint">{field.hint}</p>
              )}
            </div>
          ))}

          <div className="ds-form-group">
            <label className="ds-form-label mb-0">Store theme</label>
            <p className="ds-form-hint mb-3">
              Applies to your dashboard and storefront. The ProductShare homepage stays unchanged.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {STORE_THEMES.map((theme) => {
                const selected = storeTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => {
                      setStoreTheme(theme.id);
                      emitStoreThemeChange(theme.id);
                    }}
                    aria-pressed={selected}
                    className={`relative overflow-hidden rounded-md border p-2.5 text-left transition ${
                      selected
                        ? "border-[color:var(--ds-violet)] bg-[color:var(--ds-violet-soft)]"
                        : "border-[color:var(--ds-border)] bg-[color:var(--ds-canvas)] hover:border-[color:var(--ds-violet)]"
                    }`}
                  >
                    <div
                      className="rounded-md border p-2"
                      style={{
                        background: theme.previewSurface,
                        borderColor: theme.border,
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded" style={{ background: theme.accent }} />
                        <span
                          className="h-1.5 w-12 rounded-full"
                          style={{ background: theme.border }}
                        />
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-1.5">
                        <span className="aspect-square rounded-sm" style={{ background: theme.previewBg }} />
                        <span className="aspect-square rounded-sm" style={{ background: theme.previewBg }} />
                      </div>
                    </div>
                    <div className="mt-2 px-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold" style={{ color: "var(--ds-ink)" }}>{theme.name}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold" style={{ color: selected ? "var(--ds-violet-dark)" : "var(--ds-muted)" }}>
                          {selected ? <FiCheck /> : null}
                          {selected ? "Selected" : "Use"}
                        </span>
                      </div>
                      <p className="mt-1 text-[10px] leading-4" style={{ color: "var(--ds-muted)" }}>{theme.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="ds-form-group">
            <label className="ds-form-label mb-0">Product categories</label>
            <p className="ds-form-hint mb-3">
              Create categories for your catalog. They appear when you add or edit a product.
              {!savedProfileComplete
                ? " Save your username, store name, and WhatsApp number first."
                : ""}
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {DEFAULT_PRODUCT_CATEGORIES.map((category) => (
                <span
                  key={category.value}
                  className="rounded-full border border-[color:var(--ds-border)] px-3 py-1 text-xs text-[color:var(--ds-muted)]"
                >
                  {category.label}
                </span>
              ))}
              {productCategories.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center gap-1 rounded-full border border-[color:var(--ds-violet)] bg-[color:var(--ds-violet-soft)] px-3 py-1 text-xs font-medium text-[color:var(--ds-ink)]"
                >
                  {category}
                  <button
                    type="button"
                    onClick={() => void handleRemoveCategory(category)}
                    disabled={categorySaving}
                    className="text-[color:var(--ds-muted)] hover:text-red-500"
                    aria-label={`Remove ${category}`}
                  >
                    <FiX />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(event) => setNewCategory(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void handleAddCategory();
                  }
                }}
                className="ds-form-input"
                placeholder="e.g. Snacks, Jewellery"
                maxLength={40}
                disabled={categorySaving || !savedProfileComplete}
              />
              <button
                type="button"
                onClick={() => void handleAddCategory()}
                disabled={categorySaving || !newCategory.trim() || !savedProfileComplete}
                className="ds-btn-primary flex-shrink-0 px-4"
              >
                <FiPlus /> {categorySaving ? "Adding..." : "Add"}
              </button>
            </div>
          </div>

          <div className="ds-form-group">
            <label className="ds-form-label">Additional Notes</label>
            <textarea
              rows={3}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="ds-form-input resize-none"
              placeholder="Promo message shown on your storefront..."
            />
          </div>

          <div className="ds-form-group">
            <div className={`ds-visibility-card ${isOffline ? "is-offline" : ""}`}>
              <div className="ds-visibility-copy">
                <span className="ds-visibility-badge">
                  {isOffline ? <FiEyeOff /> : <FiEye />}
                  {isOffline ? "Offline" : "Live"}
                </span>
                <label className="ds-form-label mb-0" htmlFor="store-offline-toggle">
                  Store visibility
                </label>
                <p>
                  Take your storefront offline so visitors cannot open it. You can still preview it while signed in.
                </p>
              </div>
              <button
                id="store-offline-toggle"
                type="button"
                role="switch"
                aria-checked={!isOffline}
                aria-label={isOffline ? "Turn store online" : "Store is live"}
                disabled={!userId || visibilitySaving}
                onClick={() => void handleVisibilityToggle()}
                className={`ds-visibility-switch ${isOffline ? "" : "is-live"}`}
              >
                <i />
              </button>
            </div>
          </div>

          <motion.button
            onClick={handleSaveChanges}
            className="ds-btn-primary"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </motion.button>
        </section>

        <aside className="xl:sticky xl:top-6 xl:self-start">
          <StoreSettingsPreview
            name={name}
            username={username}
            logoUrl={previewLogoUrl}
            themeColor={STORE_THEME_MAP[storeTheme].accent}
            storeTheme={storeTheme}
            additionalNotes={additionalNotes}
            isOffline={isOffline}
          />
        </aside>
      </div>
    </div>
  );
};

export default SettingsPage;
