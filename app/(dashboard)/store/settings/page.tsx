"use client";

import React, {
  useState,
  useEffect,
  ChangeEvent,
  useMemo,
  useRef,
} from "react";
import { motion } from "framer-motion";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { userType } from "@/type";
import toast from "react-hot-toast";
import StoreSettingsPreview from "@/components/StoreSettingsPreview";
import {
  isUsernameAvailable,
  isValidUsername,
  normalizeUsername,
} from "@/helpers/username";

const SettingsPage: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [originalUsername, setOriginalUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");
  const [themeColor, setThemeColor] = useState<string>("#000000");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [logoImageUrl, setLogoImageUrl] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<string>("");
  const logoInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
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
      const userDoc = doc(db, "users", userId);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        const data: userType = docSnap.data() as userType;
        setUsername(data.username || "");
        setOriginalUsername(data.username || "");
        setName(data.name || "");
        setEmail(data.email || "");
        setWhatsappNumber(data?.whatsappNumber || "");
        setAdditionalNotes(data?.additionalNotes || "");
        setLogoImageUrl(data?.logoImage || null);
        setThemeColor(data?.themeColor || "#000000");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data.");
    }
  };

  const handleSaveChanges = async () => {
    if (!userId) return;

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
        themeColor,
        additionalNotes,
        whatsappNumber,
      };

      if (logoImage) {
        try {
          const ts = new Date().toISOString().replace(/[:.]/g, "-");
          const safeName = logoImage.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const storageRef = ref(
            storage,
            `images/logo_${userId}_${ts}_${safeName}`,
          );
          await uploadBytes(storageRef, logoImage, {
            contentType: logoImage.type || "image/jpeg",
          });
          updatedData.logoImage = await getDownloadURL(storageRef);
        } catch (uploadError) {
          console.error("Error uploading logo:", uploadError);
          toast.error("Failed to upload logo. Please try again.");
          return;
        }
      }

      await updateDoc(doc(db, "users", userId), updatedData);
      if (updatedData.logoImage) {
        setLogoImageUrl(updatedData.logoImage);
        setLogoImage(null);
        if (logoInputRef.current) logoInputRef.current.value = "";
      }
      setOriginalUsername(normalizedUsername);
      setUsername(normalizedUsername);
      toast.success("Changes saved successfully!");
      router.push("/store");
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes.");
    } finally {
      setLoading(false);
    }
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

  const previewLogoUrl = useMemo(() => {
    if (logoImage) return URL.createObjectURL(logoImage);
    return logoImageUrl;
  }, [logoImage, logoImageUrl]);

  useEffect(() => {
    if (!logoImage || !previewLogoUrl) return;
    return () => URL.revokeObjectURL(previewLogoUrl);
  }, [logoImage, previewLogoUrl]);

  return (
    <div className="ds-page">
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
            { label: "Shop Name", value: name, onChange: setName },
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
            <label className="ds-form-label">Theme Color</label>
            <input
              type="color"
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
              className="ds-form-input h-12 cursor-pointer p-1"
            />
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
            themeColor={themeColor}
            additionalNotes={additionalNotes}
          />
        </aside>
      </div>
    </div>
  );
};

export default SettingsPage;
