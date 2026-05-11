import { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { getPublicStorefrontEntries } from "@/lib/storefront";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/about-us"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/pricing"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/privacy-policy"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/terms-and-conditions"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/cancellations-and-refunds"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/shipping-policy"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/pricing-policy"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  try {
    const storefrontEntries = await getPublicStorefrontEntries();

    const dynamicPages = storefrontEntries.flatMap((entry) => {
      const storePath = `/store/${entry.store.username}`;
      const productPages = entry.products.map((product) => ({
        url: absoluteUrl(`${storePath}/${product.id}`),
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));

      return [
        {
          url: absoluteUrl(storePath),
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
