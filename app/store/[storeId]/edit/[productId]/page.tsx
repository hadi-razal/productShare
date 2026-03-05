"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Plus, X, Type, AlignLeft, DollarSign, Grid3X3, Palette, ImagePlus, SlidersHorizontal, Tag, ChevronLeft } from "lucide-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useParams, useRouter } from "next/navigation";
import { db, storage } from "@/lib/firebase";
import { getUserId } from "@/helpers/getUserId";
import { ProductType } from "@/type";

// ── Toggle Switch ─────────────────────────────────────────────────────────────
const Toggle = ({ name, checked, onChange, label, description }: any) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-sm font-medium text-gray-800">{label}</p>
      {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
    </div>
    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
      <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary transition-all after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 after:shadow-sm" />
    </label>
  </div>
);

// ── Section Card ──────────────────────────────────────────────────────────────
const Section = ({ icon: Icon, title, children }: any) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// ── Skeleton ──────────────────────────────────────────────────────────────────
const EditSkeleton = () => (
  <div className="min-h-screen bg-gray-50/60">
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-5 animate-pulse">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gray-200 rounded-xl" />
        <div className="space-y-1.5">
          <div className="h-5 w-36 bg-gray-200 rounded-full" />
          <div className="h-3.5 w-52 bg-gray-200 rounded-full" />
        </div>
      </div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="h-4 w-32 bg-gray-200 rounded-full" />
          <div className="h-11 bg-gray-100 rounded-xl" />
          {i === 0 && <div className="h-24 bg-gray-100 rounded-xl" />}
        </div>
      ))}
      <div className="h-14 bg-gray-200 rounded-2xl" />
    </div>
  </div>
);

const inputCls = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 placeholder:text-gray-400 text-sm disabled:opacity-50";
const labelCls = "block text-sm font-medium text-gray-700 mb-1.5";

const EditProduct = () => {
  const router = useRouter();
  const { storeId, productId } = useParams();

  const [productData, setProductData] = useState<ProductType>({
    id: "",
    name: "",
    description: "",
    regularPrice: 0,
    discountPrice: 0,
    colors: [],
    category: "",
    sizes: [],
    isInStock: true,
    images: [],
    tags: "",
    isFeatured: false,
    isFreeDelivery: false,
    isMostSelling: false,
    isHidden: false,
  });

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
  const [currentColor, setCurrentColor] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const userId = await getUserId(storeId as string);
        if (!userId || !productId) return;
        const productSnap = await getDoc(doc(db, "users", userId, "products", productId as string));
        if (productSnap.exists()) {
          const data = productSnap.data() as ProductType;
          setProductData(data);
          setPreviewImages(data.images || []);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setProductData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSizeChange = (size: string) => {
    setProductData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size) ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
    }));
  };

  const handleAddColor = () => {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (currentColor.trim() && hexRegex.test(currentColor.trim())) {
      setProductData((prev) => ({ ...prev, colors: [...prev.colors, currentColor.trim()] }));
      setCurrentColor("");
    }
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setProductData((prev) => ({ ...prev, category: newCategory, sizes: newCategory !== "clothing" ? [] : prev.sizes }));
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const newFiles = Array.from(event.target.files) as File[];
    setImageFiles((prev) => [...prev, ...newFiles]);
    setPreviewImages((prev) => [...prev, ...newFiles.map(URL.createObjectURL)]);
  };

  const uploadImagesToFirebase = async () => {
    const urls: string[] = [];
    for (const file of imageFiles) {
      const storageRef = ref(storage, `products/${file.name}`);
      await uploadBytes(storageRef, file);
      urls.push(await getDownloadURL(storageRef));
    }
    return urls;
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewImages[index]);
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const userId = await getUserId(storeId as string);
      if (!userId) return;
      const imageUrls = await uploadImagesToFirebase();
      const updatedData = { ...productData, images: [...productData.images, ...imageUrls] };
      await updateDoc(doc(db, "users", userId, "products", productId as string), updatedData);
      router.push(`/store/${storeId}`);
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) return <EditSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50/60">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-sm text-gray-500 truncate max-w-xs">{productData.name || "Update product details"}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Basic Info */}
          <Section icon={Type} title="Basic Information">
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={productData.name || ""}
                  onChange={handleInputChange}
                  disabled={isUploading}
                  className={inputCls}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <textarea
                  name="description"
                  value={productData.description || ""}
                  onChange={handleInputChange}
                  disabled={isUploading}
                  className={`${inputCls} min-h-28 resize-none`}
                  placeholder="Enter product description"
                />
              </div>
            </div>
          </Section>

          {/* Pricing */}
          <Section icon={DollarSign} title="Pricing">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Regular Price (₹)</label>
                <input
                  type="number"
                  name="regularPrice"
                  value={productData.regularPrice || ""}
                  onChange={handleInputChange}
                  disabled={isUploading}
                  className={inputCls}
                  placeholder="0"
                />
              </div>
              <div>
                <label className={labelCls}>Discount Price (₹)</label>
                <input
                  type="number"
                  name="discountPrice"
                  value={productData.discountPrice || ""}
                  onChange={handleInputChange}
                  disabled={isUploading}
                  className={inputCls}
                  placeholder="0"
                />
              </div>
            </div>
          </Section>

          {/* Category & Sizes */}
          <Section icon={Grid3X3} title="Category & Sizes">
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Category</label>
                <select
                  name="category"
                  value={productData.category || ""}
                  onChange={handleCategoryChange}
                  disabled={isUploading}
                  className={inputCls}
                >
                  <option value="">Select Category</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="home">Home & Garden</option>
                  <option value="sports">Sports & Outdoors</option>
                  <option value="autoMobiles">Automobiles</option>
                  <option value="books">Books</option>
                  <option value="toys">Toys & Games</option>
                  <option value="accessories">Accessories</option>
                  <option value="footwear">Footwear</option>
                </select>
              </div>
              {productData.category === "clothing" && (
                <div>
                  <label className={labelCls}>Available Sizes</label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeChange(size)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                          productData.sizes.includes(size)
                            ? "bg-primary text-white border-primary shadow-sm"
                            : "bg-white text-gray-600 border-gray-200 hover:border-primary/40"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>

          {/* Colors */}
          <Section icon={Palette} title="Available Colors">
            <div className="space-y-4">
              {productData.colors.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {productData.colors.map((color, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                      <div className="w-5 h-5 rounded-full border border-gray-300 shadow-sm flex-shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-xs text-gray-600 font-medium">{color}</span>
                      <button
                        type="button"
                        onClick={() => setProductData((prev) => ({ ...prev, colors: prev.colors.filter((c) => c !== color) }))}
                        className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl border-2 border-gray-200 flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: currentColor || "#ffffff" }}
                />
                <input
                  type="text"
                  value={currentColor}
                  onChange={(e) => setCurrentColor(e.target.value)}
                  className={`${inputCls} flex-1`}
                  placeholder="#FF5733"
                />
                <button
                  type="button"
                  onClick={handleAddColor}
                  disabled={!currentColor.trim()}
                  className="px-4 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-40 transition-all flex-shrink-0"
                >
                  Add
                </button>
              </div>
              <p className="text-xs text-gray-400">Enter a valid hex code (e.g. #FF0000)</p>
            </div>
          </Section>

          {/* Images */}
          <Section icon={ImagePlus} title="Product Images">
            <div className="space-y-4">
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {previewImages.map((image, index) => (
                  <div key={index} className="relative aspect-square group">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover rounded-xl border border-gray-200"
                    />
                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">Main</span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group">
                  <Plus className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                  <span className="text-[10px] text-gray-400 group-hover:text-primary mt-1">Add</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
              <p className="text-xs text-gray-500">New images will be added alongside existing ones.</p>
            </div>
          </Section>

          {/* Options */}
          <Section icon={SlidersHorizontal} title="Product Options">
            <div className="divide-y divide-gray-50">
              <Toggle name="isInStock" checked={productData.isInStock ?? true} onChange={handleCheckboxChange} label="In Stock" description="Product is available for purchase" />
              <Toggle name="isFeatured" checked={productData.isFeatured ?? false} onChange={handleCheckboxChange} label="Featured" description="Highlight as a featured product" />
              <Toggle name="isFreeDelivery" checked={productData.isFreeDelivery ?? false} onChange={handleCheckboxChange} label="Free Delivery" description="Offer free shipping on this product" />
              <Toggle name="isMostSelling" checked={productData.isMostSelling ?? false} onChange={handleCheckboxChange} label="Most Selling" description="Mark as a top-selling product" />
              <Toggle name="isHidden" checked={productData.isHidden ?? false} onChange={handleCheckboxChange} label="Hide Product" description="Hide this product from your catalog" />
            </div>
          </Section>

          {/* Tags */}
          <Section icon={Tag} title="Tags">
            <div>
              <label className={labelCls}>Search Tags</label>
              <input
                type="text"
                name="tags"
                value={productData.tags}
                onChange={handleInputChange}
                disabled={isUploading}
                className={inputCls}
                placeholder="summer, casual, cotton..."
              />
              <p className="text-xs text-gray-500 mt-2">Separate tags with commas.</p>
            </div>
          </Section>

          {/* Submit */}
          <button
            type="submit"
            disabled={isUploading}
            className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            style={{ background: isUploading ? "#9ca3af" : "linear-gradient(135deg, #6c64cb, #a78bfa)" }}
          >
            {isUploading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving Changes...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default EditProduct;
