"use client"

import { useEffect, useState } from "react";
import { collection, doc, getDocs, increment, updateDoc } from "firebase/firestore";
import { Search } from "lucide-react";
import { getUserId } from "@/helpers/getUserId";
import { useParams } from "next/navigation";
import { db } from "@/lib/fireabse";
import ProductCard from "@/components/ProductCard";

const Products = () => {
  const { storeId } = useParams();
  const [products, setProducts] = useState<any[]>([]);
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
          const productList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
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
    <div className="container min-h-screen max-w-7xl mx-auto px-3 py-8 pt-32">
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4">
          <select className="px-4 py-2 border rounded-lg bg-white">
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Home</option>
            <option>Sports</option>
            <option>Books</option>
          </select>
          <select className="px-4 py-2 border rounded-lg bg-white">
            <option>Sort by: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Rating</option>
          </select>
        </div>
      </div>

      <div className='rounded-md mb-5 flex items-center justify-center cursor-pointer gap-3 bg-gray-950 pr-5 w-full'>
        <input
          type='text'
          placeholder='Search Product or Category'
          className='border px-4 py-4 rounded-md w-full focus:outline-none'
        />
        <Search className='rounded-md text-[30px] cursor-pointer text-white' />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;