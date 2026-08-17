import { isUsernameTaken } from "@/lib/db";

export const USERNAME_REGEX = /^[a-z0-9]{3,30}$/;

export const normalizeUsername = (value: string) =>
  value.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

export const isValidUsername = (username: string) =>
  USERNAME_REGEX.test(username);

export const isUsernameAvailable = async (
  username: string,
  excludeUserId?: string
): Promise<boolean> => {
  const taken = await isUsernameTaken(username, excludeUserId);
  return !taken;
};
