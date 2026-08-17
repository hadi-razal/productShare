import { supabase } from "@/lib/supabase";

export const UPLOADS_BUCKET = "uploads";

const sanitizePath = (path: string) =>
  path
    .split("/")
    .filter(Boolean)
    .map((part) => part.replace(/[^a-zA-Z0-9._-]/g, "_"))
    .join("/");

export const uploadPublicFile = async (path: string, file: File) => {
  const safePath = sanitizePath(path);
  const { error } = await supabase.storage.from(UPLOADS_BUCKET).upload(safePath, file, {
    contentType: file.type || "application/octet-stream",
    cacheControl: "3600",
    upsert: true,
  });

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("bucket not found")) {
      throw new Error(
        "Supabase Storage bucket `uploads` is missing. Run supabase/schema.sql in the SQL editor, then try again.",
      );
    }
    throw error;
  }

  const { data } = supabase.storage.from(UPLOADS_BUCKET).getPublicUrl(safePath);
  return data.publicUrl;
};
