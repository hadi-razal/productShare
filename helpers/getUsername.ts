import { getStoreById } from "@/lib/db";

export const getUsername = async (id: string): Promise<string | null> => {
  try {
    const store = await getStoreById(id);
    return store?.username || null;
  } catch (error) {
    console.error("Error fetching user ID:", error);
    return null;
  }
};
