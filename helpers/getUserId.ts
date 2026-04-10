import { db } from "@/lib/firebase";
import { getDocs, query, collection, where } from "firebase/firestore";

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
      const userQuery = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].id;
      }

      return null;
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
