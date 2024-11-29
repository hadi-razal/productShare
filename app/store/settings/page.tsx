"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { onAuthStateChanged, User, updatePassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { userType } from "@/type";
import toast from "react-hot-toast";

const SettingsPage: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");
  const [themeColor, setThemeColor] = useState<string>("#000000");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [logoImageUrl, setLogoImageUrl] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<string>("");

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

    setLoading(true);

    try {
      const updatedData: Partial<userType> = {
        name,
        themeColor,
        additionalNotes,
        whatsappNumber,
      };

      // Upload profile picture if a new one is selected
      if (logoImage) {
        const storageRef = ref(storage, `profilePics/${userId}`);
        const uploadResult = await uploadBytes(storageRef, logoImage);
        const downloadUrl = await getDownloadURL(uploadResult.ref);
        updatedData.logoImage = downloadUrl;
      }

      await updateDoc(doc(db, "users", userId), updatedData);
      toast.success("Changes saved successfully!");
      router.push("/store");
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword) {
      toast.error("Please enter a new password.");
      return;
    }

    setLoading(true);

    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        toast.success("Password updated successfully.");
        setNewPassword("");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePicChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoImage(file);
    }
  };

  return (
    <div className="min-h-screen px-4 pb-10 pt-24">
      <section className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-950 mb-6">
          Store Settings
        </h2>

        {/* Profile Picture Section */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Logo (Profile Picture)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            className="block w-full bg-gray-200 p-3 border focus:outline-none rounded-md"
          />
          {logoImageUrl && (
            <img
              src={logoImageUrl}
              alt="Profile"
              className="h-32 w-32 rounded-full object-cover mt-4"
            />
          )}
          {logoImage && (
            <img
              src={URL.createObjectURL(logoImage)}
              alt="New Profile"
              className="h-32 w-32 rounded-full mt-4"
            />
          )}
          <p className="text-sm text-gray-500 mt-1">
            The image will be displayed on the header of your catalog website.
            Please ensure the image is compatible with the header, and its
            resolution should be optimized for web display. The image size must
            be under 1MB.
          </p>{" "}
        </div>

        {/* Input Fields */}
        {[
          { label: "Username", value: username, disabled: true },
          { label: "Email", value: email, disabled: true },
          { label: "Shop Name", value: name, onChange: setName },
          {
            label: "WhatsApp Number",
            value: whatsappNumber,
            onChange: setWhatsappNumber,
          },
        ].map((field, index) => (
          <div key={index} className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              {field.label}
            </label>
            <input
              type="text"
              value={field.value}
              onChange={
                field.onChange
                  ? (e) => field.onChange!(e.target.value)
                  : undefined
              }
              className="block w-full bg-gray-200 p-3 border focus:outline-none rounded-md"
              disabled={field.disabled}
            />
          </div>
        ))}

        {/* Additional Inputs */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Theme Color
          </label>
          <input
            type="color"
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
            className="w-full h-10 rounded-md border border-gray-300"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Additional Notes
          </label>
          <textarea
            rows={3}
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>

        {/* Password Section */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Change Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="block w-full bg-gray-200 p-3 border focus:outline-none rounded-md"
            placeholder="Enter new password"
          />
        </div>

        {/* Action Buttons */}
        <motion.button
          onClick={handleSaveChanges}
          className="w-full mt-4 px-4 py-2 bg-blue-950 text-white font-semibold rounded-md shadow-md hover:bg-blue-900"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </motion.button>
        <motion.button
          onClick={handlePasswordChange}
          className="w-full mt-4 px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-400"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </motion.button>
      </section>
    </div>
  );
};

export default SettingsPage;
