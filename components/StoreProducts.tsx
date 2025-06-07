"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  increment,
  updateDoc,
} from "firebase/firestore";
import { Search, X } from "lucide-react";
import { getUserId } from "@/helpers/getUserId";
import { db } from "@/lib/firebase";
import ProductCard from "@/components/ProductCard";
import { ProductType } from "@/type";
import AlertMessageSlider from "./AlertSlider";

interface StoreProductsProps {
  storeId: string | undefined;
}

const StoreProducts: React.FC<StoreProductsProps> = ({ storeId }) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [sortOption, setSortOption] = useState<string>("");
  const [visibleProducts, setVisibleProducts] = useState(20);

  const fetchProducts = async () => {
    if (!storeId) return;
    try {
      const userID = await getUserId(storeId);

      if (userID) {
        const isCounted = sessionStorage.getItem(`MyShop_${storeId}_View`);
        if (!isCounted) {
          const userDocRef = doc(db, "users", userID);
          await updateDoc(userDocRef, { visitCount: increment(1) });
          sessionStorage.setItem(`MyShop_${storeId}_View`, "true");
        }

        const productsRef = collection(db, "users", userID, "products");
        const querySnapshot = await getDocs(productsRef);

        const productList: ProductType[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            description: data.description,
            colors: data.colors || [],
            category: data.category,
            images: data.images || [],
            regularPrice: data.regularPrice,
            discountPrice: data.discountPrice,
            isNew: data.isNew || false,
            isInStock: data.isInStock || false,
            rating: data.rating || 0,
            ratingCount: data.ratingCount || 0,
            sizes: data.sizes || [],
            isMostSelling: data.isMostSelling || false,
            createdAt: data.createdAt,
            tags: data.tags || "",
            isFeatured: data.isFeatured || false,
            isHidden: data.isHidden || false,
          };
        });

        setProducts(productList);
        setFilteredProducts(productList);
      }
    } catch (error) {
      console.error("Error fetching products: ", error);
    } finally {
      setIsLoading(false); // Ensure this runs after the loop or errors
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [storeId]);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchInput(event.target.value);
  };

  const filterProducts = () => {
    let results = [...products];

    if (searchInput.trim()) {
      results = results.filter((product) => {
        const searchTerm = searchInput.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.colors.some((color) =>
            color.toLowerCase().includes(searchTerm)
          ) ||
          (product.category &&
            product.category.toLowerCase().includes(searchTerm)) ||
          (product.tags && product.tags.toLowerCase().includes(searchTerm))
        );
      });
    }

    if (sortOption) {
      results = sortProducts(results, sortOption);
    }

    setFilteredProducts(results);
  };

  const sortProducts = (
    products: ProductType[],
    option: string
  ): ProductType[] => {
    switch (option) {
      case "price-low-high":
        return products.sort(
          (a, b) =>
            (a.discountPrice || a.regularPrice) -
            (b.discountPrice || b.regularPrice)
        );
      case "price-high-low":
        return products.sort(
          (a, b) =>
            (b.discountPrice || b.regularPrice) -
            (a.discountPrice || a.regularPrice)
        );
      case "newest":
        return products.sort((a, b) => {
          const dateA = a.createdAt?.toMillis?.() || 0;
          const dateB = b.createdAt?.toMillis?.() || 0;
          return dateB - dateA;
        });
      default:
        return products;
    }
  };

  const handleSearchClick = () => filterProducts();

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") filterProducts();
  };

  const clearSearchInput = () => {
    setSearchInput("");
    setFilteredProducts(products);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
    filterProducts();
  };

  const handleLoadMore = () => setVisibleProducts((prev) => prev + 20);

  return (
    <div className="container relative min-h-screen max-w-7xl mx-auto pb-8 pt-5 px-4">
      <div className="relative flex items-center w-full pb-3">
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Search products or categories..."
          className="w-full px-4 py-3 pr-12 text-sm border rounded-lg border-gray-200 focus:outline-none placeholder:text-gray-400"
        />
        <div className="absolute right-0 flex items-center justify-center h-full space-x-1">
          {searchInput && (
            <button
              onClick={clearSearchInput}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
          <button
            onClick={handleSearchClick}
            className="p-2 text-white bg-primaryColor rounded-md px-4 py-3"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-row items-center justify-end gap-2 pb-2">
        <select
          name="sort"
          value={sortOption}
          onChange={handleSortChange}
          className="px-4 py-2 rounded-md border border-gray-200"
        >
          <option value="" disabled>
            Sort by
          </option>
          <option value="newest">Newly Added</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
        {isLoading
          ? Array.from({ length: 20 }).map((_, idx) => (
            <ProductCard
            key={idx}
            isLoading={true} // Pass the actual loading state
          />  
            ))
          : filteredProducts.slice(0, visibleProducts).map((product) => (
            <ProductCard
            key={product.id}
            isLoading={isLoading} // Pass the actual loading state
            refetchProducts={fetchProducts}
            storeId={storeId}
            product={product}
          />            
          ))}
      </div>

      {visibleProducts < filteredProducts.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 text-white bg-blue-950 rounded-md"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default StoreProducts;
