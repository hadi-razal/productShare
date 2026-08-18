"use client";

import { useEffect, useMemo, type CSSProperties, type ReactNode } from "react";
import {
  createStorefrontNav,
  StorefrontNavProvider,
} from "@/components/storefront-nav";
import {
  normalizeStoreTheme,
  STORE_THEME_MAP,
  storeThemeCssVars,
} from "@/lib/store-themes";

export default function StorefrontShell({
  theme,
  children,
  onSubdomain = false,
  apexOrigin = "",
}: {
  theme?: string | null;
  children: ReactNode;
  onSubdomain?: boolean;
  apexOrigin?: string;
}) {
  const resolved = normalizeStoreTheme(theme);
  const tokens = STORE_THEME_MAP[resolved];
  const cssVars = useMemo(() => storeThemeCssVars(tokens), [tokens]);
  const nav = useMemo(
    () => createStorefrontNav(onSubdomain, apexOrigin),
    [onSubdomain, apexOrigin],
  );

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-store-theme", resolved);
    root.setAttribute("data-store-theme-mode", tokens.dark ? "dark" : "light");
    if (tokens.serif) root.setAttribute("data-store-serif", "true");
    else root.removeAttribute("data-store-serif");
    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    return () => {
      root.removeAttribute("data-store-theme");
      root.removeAttribute("data-store-theme-mode");
      root.removeAttribute("data-store-serif");
      Object.keys(cssVars).forEach((key) => {
        root.style.removeProperty(key);
      });
    };
  }, [cssVars, resolved, tokens.dark, tokens.serif]);

  return (
    <StorefrontNavProvider value={nav}>
      <div
        className={`storefront-root storefront-${resolved}`}
        data-store-theme={resolved}
        data-store-theme-mode={tokens.dark ? "dark" : "light"}
        data-store-serif={tokens.serif ? "true" : undefined}
        style={cssVars as CSSProperties}
      >
        {children}
      </div>
    </StorefrontNavProvider>
  );
}
