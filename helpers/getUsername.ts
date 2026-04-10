import { db } from "@/lib/firebase";
import { getDoc, doc } from "firebase/firestore";

export const getUsername = async (id: string): Promise<string | null> => {
  try {
    const userDoc = doc(db, "users", id);
    const querySnapshot = await getDoc(userDoc);

    if (querySnapshot.exists()) {
      return querySnapshot.data().username;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user ID:", error);
    return null;
  }
};
