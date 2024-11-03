"use client";

import { useEffect, useState } from "react";
import { collection, doc, getDocs, increment, updateDoc } from "firebase/firestore";
import { Search, X } from "lucide-react";
import { getUserId } from "@/helpers/getUserId";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import ProductCard from "@/components/ProductCard";
import { ProductType } from "@/type";

const Products = () => {
  const { storeId } = useParams();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]); // State for filtered products

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);

      if (storeId) {
        const userID = await getUserId(storeId as string);
        console.log(userID);

        const isCounted = sessionStorage.getItem(`MyShop_${storeId}_View`);

        if (userID && !isCounted) {
          const userDocRef = doc(db, "users", userID);
          await updateDoc(userDocRef, {
            visitCount: increment(1),
          });
          sessionStorage.setItem(`MyShop_${storeId}_View`, 'true');
        }

        try {
          const productsRef = collection(db, userID as string);
          const querySnapshot = await getDocs(productsRef);

          const productList: ProductType[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name,
              description: data.description,
              colors: data?.colors,
              category: data.category,
              images: data.images,
              regularPrice: data.regularPrice,
              discountPrice: data.discountPrice,
              isNew: data.isNew,
              isInStock: data.isInStock,
              rating: data.rating,
              ratingCount: data.ratingCount,
              sizes: data.sizes,
              isMostSelling: data.isMostSelling,
            };
          });

          setProducts(productList);
          setFilteredProducts(productList); // Show all products initially
        } catch (error) {
          console.error("Error fetching products: ", error);
        }
      }

      setIsLoading(false);
    };

    fetchProducts();

    return () => {
      setProducts([]);
    };
  }, [storeId]);

  // Search handler
  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  // Function to filter products
  const filterProducts = () => {
    if (searchInput.trim() === "") {
      setFilteredProducts(products); // Show all products if input is empty
    } else {
      const results = products.filter((product) =>
        product.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        product.description.toLowerCase().includes(searchInput.toLowerCase()) ||
        (product.colors && product.colors.some(color => color.toLowerCase().includes(searchInput.toLowerCase()))) ||
        (product.category && product.category.toLowerCase().includes(searchInput.toLowerCase()))
      );
      setFilteredProducts(results);
    }
  };

  // Handle search button click
  const handleSearchClick = () => {
    filterProducts();
  };

  // Handle Enter key press
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      filterProducts();
    }
  };

  // Clear search input
  const clearSearchInput = () => {
    setSearchInput("");
    setFilteredProducts(products); // Reset to show all products
  };

  return (
    <div className="container min-h-screen max-w-7xl mx-auto px-3 py-8 pt-[90px]">

      <div className="relative flex items-center w-full pb-3">
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Search products or categories..."
          className="w-full px-4 py-3 pr-12 text-sm border rounded-lg border-gray-200 
                     focus:outline-none
                     placeholder:text-gray-400"
          aria-label="Search input"
        />

        <div className="absolute right-0 flex items-center justify-center h-full space-x-1">
          {searchInput && (
            <button
              onClick={clearSearchInput}
              className="p-2  text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}

          <button
            onClick={handleSearchClick}
            className="p-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 
                       transition-colors duration-200  px-4 py-3 flex items-center justify-center"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* <div className="flex gap-1 pb-2">
        <span className={`text-sm font-normal border py-2 px-3 rounded-md cursor-pointer  ${selectedMenu == "MostPopular" && "bg-gray-400 text-white"}`} onClick={() => setSelectedMenu("MostPopular")} >Most Popular</span>
        <span className={`text-sm font-normal border py-2 px-3 rounded-md cursor-pointer ${selectedMenu == "MostSelling" && "bg-gray-400 text-white"} `} onClick={() => setSelectedMenu("MostSelling")} >Most Selling</span>
      </div> */}


      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} storeId={storeId as string} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center">No products found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
