import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const USERNAME_REGEX = /^[a-z0-9]{3,30}$/;

export const normalizeUsername = (value: string) =>
  value.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

export const isValidUsername = (username: string) =>
  USERNAME_REGEX.test(username);

export const isUsernameAvailable = async (
  username: string,
  excludeUserId?: string
): Promise<boolean> => {
  const snapshot = await getDocs(
    query(collection(db, "users"), where("username", "==", username))
  );

  if (snapshot.empty) return true;

  return (
    !!excludeUserId &&
    snapshot.docs.length === 1 &&
    snapshot.docs[0].id === excludeUserId
  );
};
