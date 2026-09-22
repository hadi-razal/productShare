"use client";

import { useEffect, useMemo, type CSSProperties, type ReactNode } from "react";
import {
  createStorefrontNav,
  StorefrontNavProvider,
} from "@/components/storefront-nav";
import {
  ensureStoreFontStylesheet,
  normalizeStoreFont,
  STORE_FONT_MAP,
  storeFontCssVars,
  storeFontStylesheetHref,
} from "@/lib/store-fonts";
import {
  normalizeStoreTheme,
  STORE_THEME_MAP,
  storeThemeCssVars,
} from "@/lib/store-themes";

import {
  CataloguePreferencesContext,
  brandForeground,
  type CataloguePreferences,
} from "./catalogue-preferences";

export default function StorefrontShell({
  preferences = {},
  theme,
  font,
  children,
  onSubdomain = false,
  apexOrigin = "",
}: {
  preferences?: CataloguePreferences;
  theme?: string | null;
  font?: string | null;
  children: ReactNode;
  onSubdomain?: boolean;
  apexOrigin?: string;
}) {
  const resolved = normalizeStoreTheme(theme);
  const resolvedFont = normalizeStoreFont(font);
  const tokens = STORE_THEME_MAP[resolved];
  const fontTokens = STORE_FONT_MAP[resolvedFont];
  const brandColor = /^#[0-9a-f]{6}$/i.test(preferences.themeColor || "")
    ? preferences.themeColor
    : null;
  const cssVars = useMemo(
    () => ({
      ...storeThemeCssVars(tokens),
      ...storeFontCssVars(fontTokens),
      ...(brandColor
        ? {
            "--sf-accent": brandColor,
            "--sf-accent-text": brandForeground(brandColor),
          }
        : {}),
    }),
    [fontTokens, tokens, brandColor],
  );
  const nav = useMemo(
    () => createStorefrontNav(onSubdomain, apexOrigin),
    [onSubdomain, apexOrigin],
  );

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-store-theme", resolved);
    root.setAttribute("data-store-theme-mode", tokens.dark ? "dark" : "light");
    root.setAttribute("data-store-font", resolvedFont);
    if (tokens.serif) root.setAttribute("data-store-serif", "true");
    else root.removeAttribute("data-store-serif");
    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    ensureStoreFontStylesheet(storeFontStylesheetHref(resolvedFont));
    return () => {
      root.removeAttribute("data-store-theme");
      root.removeAttribute("data-store-theme-mode");
      root.removeAttribute("data-store-serif");
      root.removeAttribute("data-store-font");
      Object.keys(cssVars).forEach((key) => {
        root.style.removeProperty(key);
      });
    };
  }, [cssVars, resolved, resolvedFont, tokens.dark, tokens.serif]);

  return (
    <CataloguePreferencesContext.Provider value={preferences}>
      <StorefrontNavProvider value={nav}>
        <div
          className={`storefront-root storefront-${resolved}`}
          data-store-theme={resolved}
          data-store-theme-mode={tokens.dark ? "dark" : "light"}
          data-store-font={resolvedFont}
          data-store-serif={tokens.serif ? "true" : undefined}
          style={cssVars as CSSProperties}
        >
          {children}
        </div>
      </StorefrontNavProvider>
    </CataloguePreferencesContext.Provider>
  );
}
