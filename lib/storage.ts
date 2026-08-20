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

export const publicUrlToStoragePath = (url: string) => {
  try {
    const parsed = new URL(url);
    const marker = `/storage/v1/object/public/${UPLOADS_BUCKET}/`;
    const index = parsed.pathname.indexOf(marker);
    if (index === -1) return null;
    return decodeURIComponent(parsed.pathname.slice(index + marker.length));
  } catch {
    return null;
  }
};

export const deletePublicFiles = async (urls: Array<string | null | undefined>) => {
  const paths = Array.from(
    new Set(
      urls
        .map((url) => (typeof url === "string" ? publicUrlToStoragePath(url) : null))
        .filter((path): path is string => Boolean(path)),
    ),
  );
  if (!paths.length) return;

  const { error } = await supabase.storage.from(UPLOADS_BUCKET).remove(paths);
  if (error) throw error;
};
