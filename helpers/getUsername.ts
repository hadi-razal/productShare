import { db } from "@/lib/fireabase";
import { getDoc, doc } from "firebase/firestore";

// Function to get user ID by username
export const getUsername = async (id: string): Promise<string | null> => {
  try {
    const userDoc = doc(db, "users", id);
    const querySnapshot = await getDoc(userDoc);

    if (querySnapshot.exists()) {
      return querySnapshot.data().username; // Access the username field correctly
    } else {
      console.log("No user found with the specified ID.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user ID:", error);
    return null;
  }
};
