"use client";

import { createContext, useContext } from "react";

export type StorefrontNav = {
  onSubdomain: boolean;
  apexOrigin: string;
  catalogHref: (username: string) => string;
  productHref: (username: string, productId: string) => string;
  editHref: (username: string, productId: string) => string;
  dashboardHref: (path: string) => string;
};

export const createStorefrontNav = (
  onSubdomain: boolean,
  apexOrigin: string,
): StorefrontNav => ({
  onSubdomain,
  apexOrigin,
  catalogHref: (username) => (onSubdomain ? "/" : `/store/${username}`),
  productHref: (username, productId) =>
    onSubdomain ? `/${productId}` : `/store/${username}/${productId}`,
  editHref: (_username, productId) =>
    onSubdomain ? `${apexOrigin}/store/edit/${productId}` : `/store/edit/${productId}`,
  dashboardHref: (path) => (onSubdomain ? `${apexOrigin}${path}` : path),
});

const defaultNav = createStorefrontNav(false, "");

const StorefrontNavContext = createContext<StorefrontNav>(defaultNav);

export const StorefrontNavProvider = StorefrontNavContext.Provider;

export const useStorefrontNav = () => useContext(StorefrontNavContext);
