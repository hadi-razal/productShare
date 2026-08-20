import { redirect } from "next/navigation";

interface EditProductRedirectProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function EditProductRedirect({
  params,
}: EditProductRedirectProps) {
  const { productId } = await params;
  redirect(`/store/edit/${productId}`);
}
