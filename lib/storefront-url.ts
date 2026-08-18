import { siteConfig } from "@/lib/site";
import { isValidUsername } from "@/lib/username-rules";

export const SITE_HOST = "productshare.in";

const APEX_HOSTNAMES = new Set([SITE_HOST, `www.${SITE_HOST}`, "localhost", "127.0.0.1"]);

export const stripPort = (host: string) =>
  host.trim().toLowerCase().replace(/:\d+$/, "");

export const hostPort = (host: string) => {
  const match = host.trim().match(/:(\d+)$/);
  return match ? match[1] : "";
};

export const isLocalHost = (host: string) => {
  const hostname = stripPort(host);
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".localhost")
  );
};

export const isApexHost = (host: string) => {
  const hostname = stripPort(host);
  return hostname === SITE_HOST || hostname === `www.${SITE_HOST}`;
};

export const getStorefrontUsernameFromHost = (
  hostHeader: string | null | undefined,
): string | null => {
  if (!hostHeader) return null;
  const hostname = stripPort(hostHeader);
  if (APEX_HOSTNAMES.has(hostname)) return null;

  let sub: string | null = null;
  if (hostname.endsWith(`.${SITE_HOST}`)) {
    sub = hostname.slice(0, -(SITE_HOST.length + 1));
  } else if (hostname.endsWith(".localhost")) {
    sub = hostname.slice(0, -".localhost".length);
  } else {
    return null;
  }

  if (!sub || sub.includes(".")) return null;
  if (!isValidUsername(sub)) return null;
  return sub;
};

export const storefrontPublicUrl = (username: string, extraPath = "") => {
  const path = extraPath.startsWith("/") ? extraPath : extraPath ? `/${extraPath}` : "";
  const clean = path === "/" ? "" : path;
  return `https://${username}.${SITE_HOST}${clean}`;
};

export const storefrontDisplayHost = (username: string) => `${username}.${SITE_HOST}`;

export const storefrontInternalPath = (username: string, extraPath = "") => {
  const path = extraPath.replace(/^\/+/, "");
  return path ? `/store/${username}/${path}` : `/store/${username}`;
};

export const getApexOrigin = (hostHeader: string, protoHeader?: string | null) => {
  if (isLocalHost(hostHeader)) {
    const proto = protoHeader === "https" ? "https" : "http";
    const port = hostPort(hostHeader);
    return `${proto}://localhost${port ? `:${port}` : ""}`;
  }
  return siteConfig.url;
};

export const storefrontRequestContext = (headerList: Headers) => {
  const host = headerList.get("x-forwarded-host") || headerList.get("host") || "";
  const onSubdomain = Boolean(getStorefrontUsernameFromHost(host));
  const username =
    headerList.get("x-storefront-username") ||
    getStorefrontUsernameFromHost(host);
  return {
    host,
    username,
    onSubdomain,
    apexOrigin: getApexOrigin(host, headerList.get("x-forwarded-proto")),
  };
};

export const storefrontOpenUrl = (
  username: string,
  extraPath = "",
  currentHost?: string,
) => {
  const host =
    currentHost ||
    (typeof window !== "undefined" ? window.location.host : SITE_HOST);
  if (isLocalHost(host)) {
    const origin =
      typeof window !== "undefined"
        ? `${window.location.protocol}//localhost${window.location.port ? `:${window.location.port}` : ""}`
        : getApexOrigin(host);
    return `${origin}${storefrontInternalPath(username, extraPath)}`;
  }
  return storefrontPublicUrl(username, extraPath);
};
