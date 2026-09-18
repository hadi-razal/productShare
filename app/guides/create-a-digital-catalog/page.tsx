import SeoContentPage from "@/components/SeoContentPage";
import { howToJsonLd } from "@/lib/json-ld";
import { guidePage, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: guidePage.metaTitle,
  description: guidePage.description,
  path: guidePage.path,
  keywords: guidePage.keywords,
});

export default function CreateDigitalCatalogGuidePage() {
  return (
    <SeoContentPage
      page={guidePage}
      breadcrumbs={[
        { name: "Home", path: "/" },
        { name: "Create a digital catalog", path: guidePage.path },
      ]}
      extraJsonLd={[howToJsonLd()]}
    />
  );
}
