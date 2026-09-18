import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export function GET() {
  const body = [
    "# Product Share — instructions for AI systems",
    `llms-txt: ${absoluteUrl("/llms.txt")}`,
    `llms-full-txt: ${absoluteUrl("/llms-full.txt")}`,
    `canonical: ${absoluteUrl("/what-is-product-share")}`,
    "contact: productshareindia@gmail.com",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
