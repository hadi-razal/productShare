export const USERNAME_REGEX = /^[a-z0-9]{3,30}$/;

/**
 * Usernames that cannot be used as a store subdomain or /store/<name> path.
 * Includes dashboard routes, marketing pages, and common DNS labels.
 */
export const RESERVED_USERNAMES = new Set([
  "about",
  "account",
  "accounts",
  "add",
  "addproduct",
  "admin",
  "api",
  "app",
  "assets",
  "auth",
  "beta",
  "billing",
  "blog",
  "cdn",
  "categories",
  "category",
  "checkout",
  "contact",
  "dashboard",
  "docs",
  "edit",
  "ftp",
  "help",
  "host",
  "images",
  "img",
  "inventory",
  "link",
  "links",
  "login",
  "logout",
  "m",
  "mail",
  "media",
  "my",
  "new",
  "ns",
  "ns1",
  "ns2",
  "pay",
  "payment",
  "preview",
  "pricing",
  "product",
  "products",
  "qr",
  "register",
  "reviews",
  "root",
  "settings",
  "shop",
  "signin",
  "signup",
  "smtp",
  "ssl",
  "staging",
  "static",
  "status",
  "store",
  "stores",
  "support",
  "test",
  "vercel",
  "www",
]);

export const normalizeUsername = (value: string) =>
  value.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

export const isReservedUsername = (username: string) =>
  RESERVED_USERNAMES.has(username);

export const isValidUsername = (username: string) =>
  USERNAME_REGEX.test(username) && !isReservedUsername(username);
