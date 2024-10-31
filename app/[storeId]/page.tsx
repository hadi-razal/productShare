"use client";

import { useEffect, useState } from "react";
import { collection, doc, getDocs, increment, updateDoc } from "firebase/firestore";
import { Search } from "lucide-react";
import { getUserId } from "@/helpers/getUserId";
import { useParams } from "next/navigation";
import { db } from "@/lib/fireabase";
import ProductCard from "@/components/ProductCard";

// Define a type for your products
interface Product {
  id: string; // Add id property to the Product interface
  name: string;
  description: string;
  category: string;
  images: string[];
  regularPrice: number;
  discountPrice: number;
  isNew: boolean;
  isInStock: boolean;
  rating: number;
  ratingCount: number;
}

const Products = () => {
  const { storeId } = useParams();
  const [products, setProducts] = useState<Product[]>([]); // Use the defined Product type
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true); // Start loading

      if (storeId) {
        const userID = await getUserId(storeId as string);
        console.log(userID);

        const isCounted = localStorage.getItem(`MyShop_${storeId}_View`);

        if (userID && !isCounted) {
          const userDocRef = doc(db, "users", userID);
          await updateDoc(userDocRef, {
            visitCount: increment(1),
          });
          localStorage.setItem(`MyShop_${storeId}_View`, 'true');
        }

        try {
          const productsRef = collection(db, userID as string);
          const querySnapshot = await getDocs(productsRef);

          const productList: Product[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name,
              description: data.description,
              category: data.category,
              images: data.images,
              regularPrice: data.regularPrice,
              discountPrice: data.discountPrice,
              isNew: data.isNew,
              isInStock: data.isInStock,
              rating: data.rating,
              ratingCount: data.ratingCount,
            };
          });

          setProducts(productList);
        } catch (error) {
          console.error("Error fetching products: ", error);
        }
      }

      setIsLoading(false); // End loading
    };

    fetchProducts();

    // Cleanup function to avoid memory leaks if needed
    return () => {
      setProducts([]); // Reset products if component unmounts
    };
  }, [storeId]);
  

  return (
    <div className="container min-h-screen max-w-7xl mx-auto px-3 py-8 pt-[90px]">        

      <div className='rounded-md mb-5 flex items-center justify-center cursor-pointer gap-3 bg-gray-950 pr-5 w-full'>
        <input
          type='text'
          placeholder='Search Product or Category'
          className='border px-4 py-4 bg-gray-100 rounded-md w-full focus:outline-none'
        />
        <Search className='rounded-md text-[30px] cursor-pointer text-white' />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      )}
    </div>
  );
};

export default Products;
