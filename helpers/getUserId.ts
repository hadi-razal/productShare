import { getStoreByUsername } from "@/lib/db";

const userIdPromiseCache = new Map<string, Promise<string | null>>();

export const getUserId = async (username: string): Promise<string | null> => {
  if (!username) {
    return null;
  }

  const cachedPromise = userIdPromiseCache.get(username);
  if (cachedPromise) {
    return cachedPromise;
  }

  const userIdPromise = (async () => {
    try {
      const store = await getStoreByUsername(username);
      return store?.id ?? null;
    } catch (error) {
      console.error("Error fetching user ID:", error);
      return null;
    }
  })();

  userIdPromiseCache.set(username, userIdPromise);

  try {
    return await userIdPromise;
  } catch (error) {
    userIdPromiseCache.delete(username);
    console.error("Error fetching user ID:", error);
    return null;
  }
};
