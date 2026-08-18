import { isUsernameTaken } from "@/lib/db";

export {
  USERNAME_REGEX,
  RESERVED_USERNAMES,
  normalizeUsername,
  isReservedUsername,
  isValidUsername,
} from "@/lib/username-rules";

export const isUsernameAvailable = async (
  username: string,
  excludeUserId?: string,
): Promise<boolean> => {
  const taken = await isUsernameTaken(username, excludeUserId);
  return !taken;
};
