"use client";

import { useEffect, useState } from "react";
import { collection, doc, getDocs, increment, updateDoc } from "firebase/firestore";
import { Search, X } from "lucide-react";
import { getUserId } from "@/helpers/getUserId";
import { db } from "@/lib/firebase";
import ProductCard from "@/components/ProductCard";
import { ProductType } from "@/type";

const StoreProducts = ({ storeId }: any) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [sortOption, setSortOption] = useState<string>("");
  const [visibleProducts, setVisibleProducts] = useState(20); // Initial visible product count

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
        sessionStorage.setItem(`MyShop_${storeId}_View`, "true");
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
            tags: data.tags,
            isFeatured: data.isFeatured,
            isHidden: data.isHidden,
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

  useEffect(() => {
    fetchProducts();
    return () => {
      setProducts([]);
    };
  }, [storeId]);

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const filterProducts = () => {
    let results = [...products];
    if (searchInput.trim() !== "") {
      results = results.filter(
        (product) =>
          product.name.toLowerCase().includes(searchInput.toLowerCase()) ||
          product.description.toLowerCase().includes(searchInput.toLowerCase()) ||
          (product.colors && product.colors.some((color) => color.toLowerCase().includes(searchInput.toLowerCase()))) ||
          (product.category && product.category.toLowerCase().includes(searchInput.toLowerCase())) ||
          (product.tags && product.tags.toLowerCase().includes(searchInput.toLowerCase()))
      );
    }

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

  const handleSearchClick = () => {
    filterProducts();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      filterProducts();
    }
  };

  const clearSearchInput = () => {
    setSearchInput("");
    setFilteredProducts(products);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
    filterProducts();
  };

  useEffect(() => {
    filterProducts();
  }, [sortOption]);

  const handleLoadMore = () => {
    setVisibleProducts((prevVisible) => prevVisible + 20);
  };

  return (
    <div className="container relative min-h-screen max-w-7xl mx-auto pb-8 pt-[130px] px-4">
      <div className="relative flex items-center w-full pb-3">
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Search products or categories..."
          className="w-full px-4 py-3 pr-12 text-sm border rounded-lg border-gray-200 focus:outline-none placeholder:text-gray-400"
          aria-label="Search input"
        />

        <div className="absolute right-0 flex items-center justify-center h-full space-x-1">
          {searchInput && (
            <button onClick={clearSearchInput} className="p-2 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Clear search">
              <X size={18} />
            </button>
          )}

          <button
            onClick={handleSearchClick}
            className="p-2 text-white bg-blue-950 rounded-md transition-colors duration-200 px-4 py-3 flex items-center justify-center"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-row items-center justify-end gap-2 pb-2">
        <select
          name="sort"
          onChange={handleSortChange}
          className="px-4 py-2 focus:outline-none rounded-md border border-gray-200"
          value={sortOption}
        >
          <option value="" disabled>
            Sort by
          </option>
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
        <>
          {filteredProducts.length === 0 ? (
            <div className="flex items-center justify-center w-full h-[300px]">
              <span className="text-center text-gray-500">No Products Available</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
              {filteredProducts.slice(0, visibleProducts).map((product) => (
                <ProductCard key={product.id} refetchProducts={fetchProducts} storeId={storeId as string} product={product} />
              ))}
            </div>
          )}
        </>
      )}


      {visibleProducts < filteredProducts.length && (
        <div className="flex justify-center mt-4">
          <button onClick={handleLoadMore} className="px-6 py-2 text-white bg-blue-950 rounded-md">
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default StoreProducts;
