import { MetadataRoute } from "next";
import { marketingRoutes } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { getPublicStorefrontEntries } from "@/lib/storefront";
import { storefrontPublicUrl } from "@/lib/storefront-url";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const staticPages: MetadataRoute.Sitemap = marketingRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  try {
    const storefrontEntries = await getPublicStorefrontEntries();

    const dynamicPages = storefrontEntries.flatMap((entry) => {
      const productPages = entry.products.map((product) => ({
        url: storefrontPublicUrl(entry.store.username, `/${product.id}`),
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));

      return [
        {
          url: storefrontPublicUrl(entry.store.username),
          lastModified,
          changeFrequency: "weekly" as const,
          priority: 0.8,
        },
        ...productPages,
      ];
    });

    return [...staticPages, ...dynamicPages];
  } catch {
    return staticPages;
  }
}
