import { notFound } from "next/navigation";
import SeoContentPage from "@/components/SeoContentPage";
import { getSolutionBySlug, pageMetadata, solutionPages } from "@/lib/seo";

type SolutionRouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return solutionPages.map((page) => ({ slug: page.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: SolutionRouteProps) {
  const { slug } = await params;
  const page = getSolutionBySlug(slug);
  if (!page) {
    return pageMetadata({
      title: "Catalog solution",
      description: "Product Share catalog solutions.",
      path: "/solutions",
      noIndex: true,
    });
  }

  return pageMetadata({
    title: page.metaTitle,
    description: page.description,
    path: page.path,
    keywords: page.keywords,
  });
}

export default async function SolutionSlugPage({ params }: SolutionRouteProps) {
  const { slug } = await params;
  const page = getSolutionBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <SeoContentPage
      page={page}
      breadcrumbs={[
        { name: "Home", path: "/" },
        { name: "Solutions", path: "/solutions" },
        { name: page.eyebrow, path: page.path },
      ]}
    />
  );
}
