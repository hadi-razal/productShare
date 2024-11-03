import { Metadata } from 'next';
import Image from 'next/image';
import { Share2, Star } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { getUserId } from '@/helpers/getUserId';
import { db } from '@/lib/firebase';
import { ProductType } from '@/type';

type Props = {
  params: {
    storeId?: string;
    productId?: string;
  };
};

// Generate metadata
export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const { storeId, productId } = params;
  
  const userId = await getUserId(storeId as string);
  const productRef = doc(db, userId as string, productId as string);
  const productSnap = await getDoc(productRef);
  const product = productSnap.exists() ? (productSnap.data() as ProductType) : null;

  return {
    title: product?.name || 'Product Not Found',
    description: product?.description || 'Product details',
    openGraph: {
      title: product?.name || 'Product',
      description: product?.description || 'Check out this product!',
      images: product?.images?.[0] ? [product.images[0]] : [],
      url: `https://productshare.vercel.app/store/${storeId}/${productId}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: product?.name || 'Product',
      description: product?.description || 'Check out this product!',
      images: product?.images?.[0] ? [product.images[0]] : [],
    },
  };
}

// Server-side data fetching
async function getProduct(userId: string, productId: string): Promise<ProductType | null> {
  try {
    const productRef = doc(db, userId, productId);
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
      return productSnap.data() as ProductType;
    }
    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// Rating Stars Component
const RatingStars = ({ rating = 4.5, totalReviews = 128 }: { rating?: number; totalReviews?: number }) => (
  <div className="flex items-center gap-2">
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${
            star <= Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
    <span className="text-sm text-gray-500">({totalReviews} reviews)</span>
  </div>
);

// Calculate discount percentage
const calculateDiscount = (regularPrice: number, discountPrice: number): number => {
  if (regularPrice && discountPrice) {
    const discount = ((regularPrice - discountPrice) / regularPrice) * 100;
    return Math.round(discount);
  }
  return 0;
};

export default async function ProductPage({ params }: Props) {
  const { storeId, productId } = params;
  const userId = await getUserId(storeId as string);
  const productData = await getProduct(userId as string, productId as string);

  if (!productData) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Product not found</h2>
        <p className="mt-2 text-gray-600">
          The product you are looking for does not exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 pt-32 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image Section */}
        <div className="space-y-4">
          <ImageGallery images={productData.images || []} productName={productData.name} />
        </div>

        {/* Product Details Section */}
        <div className="space-y-4">
          {productData.isInStock === false && (
            <span className="px-3 py-1 bg-red-700 text-white rounded-full text-sm font-medium">
              Out of Stock
            </span>
          )}
          
          <h1 className="md:text-3xl text-lg font-semibold text-gray-950">
            {productData.name}
          </h1>
          
          <RatingStars rating={productData.rating} totalReviews={productData.totalReviews} />

          {/* Pricing */}
          <div className="flex items-center gap-2">
            {productData.discountPrice ? (
              <>
                <span className="md:text-3xl text-lg font-bold text-gray-900">
                  ₹{productData.discountPrice}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  ₹{productData.regularPrice}
                </span>
                <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                  {calculateDiscount(productData.regularPrice, productData.discountPrice)}% OFF
                </span>
              </>
            ) : (
              <span className="md:text-3xl text-lg font-bold text-gray-900">
                ₹{productData.regularPrice}
              </span>
            )}
          </div>

          {/* Colors */}
          {productData.colors?.length > 0 && (
            <div className='flex flex-col justify-center gap-2'>
              <span className='text-md text-gray-950 font-medium opacity-85'>
                Available Colors:
              </span>
              <div className='flex items-center gap-1 flex-wrap'>
                {productData.colors.map((color: string, index: number) => (
                  <span
                    key={index}
                    style={{ background: color }}
                    className="relative h-[35px] w-[35px] rounded-[50%] flex items-center justify-center shadow-lg"
                  />
                ))}
              </div>
            </div>
          )}

          <p className="text-gray-600 leading-relaxed border-t border-gray-200 pt-4">
            {productData.description}
          </p>

          {/* Actions */}
          <div className="flex gap-4 mt-4">
            <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-shadow hover:shadow-lg">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Image Gallery Component (Converted to Server Component)
function ImageGallery({ images, productName }: { images: string[]; productName: string }) {
  const firstImage = images && images.length > 0 ? images[0] : null;

  return (
    <div className="relative rounded-lg overflow-hidden w-full h-96 flex items-center justify-center">
      {firstImage ? (
        <Image
          quality={50}
          unoptimized={true}
          width={0}
          height={0}
          src={firstImage}
          alt={productName}
          className="object-contain h-full w-full"
        />
      ) : (
        <div className="flex items-center justify-center text-gray-500">
          No image available
        </div>
      )}
    </div>
  );
}
