import { NextRequest, NextResponse } from "next/server";
import { isValidUsername } from "@/lib/username-rules";
import {
  getStorefrontUsernameFromHost,
  isApexHost,
  isLocalHost,
  SITE_HOST,
  storefrontInternalPath,
  storefrontPublicUrl,
} from "@/lib/storefront-url";

const APEX_ONLY_PREFIXES = [
  "/login",
  "/register",
  "/auth",
  "/forgot-password",
  "/reset-password",
  "/pricing",
  "/about-us",
  "/contact",
  "/privacy-policy",
  "/terms-and-conditions",
  "/cancellations-and-refunds",
  "/shipping-policy",
  "/pricing-policy",
  "/api",
  "/admin",
];

const isDashboardPath = (pathname: string) => {
  if (pathname === "/store" || pathname === "/store/") return true;
  return (
    pathname.startsWith("/store/settings") ||
    pathname.startsWith("/store/products") ||
    pathname.startsWith("/store/categories") ||
    pathname.startsWith("/store/add-product") ||
    pathname === "/store/edit" ||
    pathname.startsWith("/store/edit/") ||
    pathname.startsWith("/store/reviews")
  );
};

const isApexOnlyPath = (pathname: string) =>
  APEX_ONLY_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

const rewriteToStorefront = (request: NextRequest, username: string, extraPath = "") => {
  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = storefrontInternalPath(username, extraPath);
  const headers = new Headers(request.headers);
  headers.set("x-storefront-username", username);
  return NextResponse.rewrite(rewriteUrl, { request: { headers } });
};

const absoluteApexUrl = (request: NextRequest, pathname: string, search: string) => {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const port = request.nextUrl.port;
  const origin = isLocalHost(host)
    ? `http://localhost${port ? `:${port}` : ""}`
    : `https://${SITE_HOST}`;
  return `${origin}${pathname}${search}`;
};

const redirectToApex = (request: NextRequest, pathname: string, search: string) =>
  new NextResponse(null, {
    status: 307,
    headers: { Location: absoluteApexUrl(request, pathname, search) },
  });

export function middleware(request: NextRequest) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const { pathname, search } = request.nextUrl;
  const usernameFromHost = getStorefrontUsernameFromHost(host);

  if (usernameFromHost) {
    if (isDashboardPath(pathname) || isApexOnlyPath(pathname)) {
      return redirectToApex(request, pathname, search);
    }

    if (pathname.startsWith("/edit/")) {
      return redirectToApex(request, `/store${pathname}`, search);
    }

    const prefixed = `/store/${usernameFromHost}`;
    if (pathname === prefixed || pathname.startsWith(`${prefixed}/`)) {
      const rest = pathname.slice(prefixed.length) || "/";
      const url = request.nextUrl.clone();
      url.pathname = rest;
      return NextResponse.redirect(url);
    }

    return rewriteToStorefront(request, usernameFromHost, pathname);
  }

  if (pathname.startsWith("/store/")) {
    const segments = pathname.split("/").filter(Boolean);
    const candidate = segments[1];
    const extra = segments.slice(2);
    if (candidate && extra[0] === "edit" && extra[1]) {
      const url = request.nextUrl.clone();
      url.pathname = `/store/edit/${extra[1]}`;
      return NextResponse.redirect(url);
    }
    if (candidate && isValidUsername(candidate) && !isDashboardPath(pathname)) {
      if (isApexHost(host) && extra[0] !== "edit") {
        return NextResponse.redirect(
          storefrontPublicUrl(candidate, extra.length ? `/${extra.join("/")}` : "/") + search,
          308,
        );
      }

      const headers = new Headers(request.headers);
      headers.set("x-storefront-username", candidate);
      return NextResponse.next({ request: { headers } });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|txt|xml|webmanifest)$).*)",
  ],
};
