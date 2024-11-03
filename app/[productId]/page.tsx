// app/product/[productId]/page.tsx
import { Metadata } from 'next';

// Server component that can fetch metadata for SSR
export async function generateMetadata({ params }: { params: { productId: string } }): Promise<Metadata> {
  const productId = params.productId;


  return {
    title: productId,
    
  };
}

export default function Page() {
  return <h1>Hi</h1>;
}
