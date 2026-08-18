import { isUsernameTaken } from "@/lib/db";

export const USERNAME_REGEX = /^[a-z0-9]{3,30}$/;

/**
 * Usernames that would shadow a real route. `/store/<username>` shares its
 * path space with the dashboard pages under `/store/...`, so a store named
 * "settings" or "inventory" could never be reached.
 */
export const RESERVED_USERNAMES = new Set([
  "add",
  "addproduct",
  "admin",
  "api",
  "app",
  "auth",
  "billing",
  "contact",
  "dashboard",
  "edit",
  "help",
  "inventory",
  "login",
  "logout",
  "new",
  "pricing",
  "product",
  "products",
  "register",
  "reviews",
  "settings",
  "signin",
  "signup",
  "store",
  "stores",
  "support",
]);

export const normalizeUsername = (value: string) =>
  value.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

export const isReservedUsername = (username: string) =>
  RESERVED_USERNAMES.has(username);

export const isValidUsername = (username: string) =>
  USERNAME_REGEX.test(username) && !isReservedUsername(username);

export const isUsernameAvailable = async (
  username: string,
  excludeUserId?: string
): Promise<boolean> => {
  const taken = await isUsernameTaken(username, excludeUserId);
  return !taken;
};
