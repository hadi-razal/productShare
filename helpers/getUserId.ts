import { db } from "@/lib/firebase";
import { getDocs, query, collection, where } from "firebase/firestore";

// Function to get user ID by username
export const getUserId = async (username: string): Promise<string | null> => {
  try {
    const userQuery = await query(collection(db, "users"), where("username", "==", username));
    console.log(username)
    const querySnapshot = await getDocs(userQuery);

    console.log(querySnapshot)

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].id;
    } else {
      console.log("No user found with the specified username.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user ID:", error);
    return null;
  }
};
