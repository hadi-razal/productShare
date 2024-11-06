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
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [sortOption, setSortOption] = useState<string>("");

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
              createdAt: data.createdAt,
            };
          });

          setProducts(productList);
          setFilteredProducts(productList);
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

  // Function to filter and sort products
  const filterProducts = () => {
    let results = [...products]; // Create a new array to avoid mutating state directly

    // Apply search filter
    if (searchInput.trim() !== "") {
      results = results.filter((product) =>
        product.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        product.description.toLowerCase().includes(searchInput.toLowerCase()) ||
        (product.colors && product.colors.some(color => color.toLowerCase().includes(searchInput.toLowerCase()))) ||
        (product.category && product.category.toLowerCase().includes(searchInput.toLowerCase()))
      );
    }

    // Apply sorting
    switch (sortOption) {
      case "price-low-high":
        results.sort((a, b) => (a.discountPrice || a.regularPrice) - (b.discountPrice || b.regularPrice));
        break;
      case "price-high-low":
        results.sort((a, b) => (b.discountPrice || b.regularPrice) - (a.discountPrice || a.regularPrice));
        break;
      case "newest":
        results.sort((a, b) => {
          const dateA = a.createdAt?.toMillis?.() || 0;
          const dateB = b.createdAt?.toMillis?.() || 0;
          return dateB - dateA;
        });
        break;
      default:
        break;
    }

    setFilteredProducts(results);
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
    setFilteredProducts(products);
  };

  // Handle sort option change
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
    filterProducts();
  };

  // Effect to reapply sorting when sort option changes
  useEffect(() => {
    filterProducts();
  }, [sortOption]);

  return (
    <div className="container min-h-screen max-w-7xl mx-auto px-3 pb-8 pt-[100px]">
      <div className="relative flex items-center w-full pb-3">
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Search products or categories..."
          className="w-full px-4 py-4 pr-12 text-sm border rounded-lg border-gray-200 
                     focus:outline-none
                     placeholder:text-gray-400"
          aria-label="Search input"
        />

        <div className="absolute right-0 flex items-center justify-center h-full space-x-1">
          {searchInput && (
            <button
              onClick={clearSearchInput}
              className="p-2 py-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}

          <button
            onClick={handleSearchClick}
            className="p-2 text-white bg-blue-950 rounded-md  hover:bg-blue-900 
                       transition-colors duration-200 px-4 py-4 flex items-center justify-center"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end gap-1 pb-2">
        <select
          name="sort"
          onChange={handleSortChange}
          className="px-4 py-2 focus:outline-none rounded-md border border-gray-200"
          value={sortOption} // This sets the current value based on state
        >
          <option value="" disabled>Select sort option</option> // Placeholder for default selection
          <option value="newest">Newly Added</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
        </select>
      </div>


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