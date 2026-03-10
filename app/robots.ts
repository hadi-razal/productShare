import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/store/settings",
          "/store/add-product",
          "/store/reviews",
          "/store/*/edit/",
          "/login",
          "/register",
          "/forgot-password",
          "/api/",
        ],
      },
    ],
    sitemap: "https://productshare.in/sitemap.xml",
    host: "https://productshare.in",
  };
}
