"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { ImagePlus, Plus, Tag, Type, AlignLeft, DollarSign, Grid3X3, Palette, Video, SlidersHorizontal, X, ChevronLeft } from "lucide-react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase";
import { ProductType } from "@/type";
import { useRouter } from "next/navigation";
// @ts-ignore
import { ChromePicker, ColorResult } from "react-color";

// ── Toggle Switch ────────────────────────────────────────────────────────────
const Toggle = ({ name, checked, onChange, label, description }: any) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-sm font-medium text-gray-800">{label}</p>
      {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
    </div>
    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary transition-all after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 after:shadow-sm" />
    </label>
  </div>
);

// ── Section Card ─────────────────────────────────────────────────────────────
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

// ── Field ────────────────────────────────────────────────────────────────────
const inputCls = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 placeholder:text-gray-400 text-sm disabled:opacity-50";
const labelCls = "block text-sm font-medium text-gray-700 mb-1.5";

const CreateProduct = () => {
  const [productData, setProductData] = useState<ProductType>({
    name: "",
    description: "",
    regularPrice: "",
    discountPrice: "",
    colors: [],
    video: "",
    category: "",
    sizes: [],
    isInStock: true,
    images: [],
    tags: "",
    views: 0,
    isFreeDelivery: false,
    isMostSelling: false,
  });

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
  const [currentColor, setCurrentColor] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [videoCompressing, setVideoCompressing] = useState(false);

  const router = useRouter();

  const compressVideo = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const video = document.createElement("video");
      video.src = URL.createObjectURL(file);
      video.muted = true;
      video.playsInline = true;
      video.onloadedmetadata = () => {
        const maxWidth = 720, maxHeight = 480;
        let { videoWidth, videoHeight } = video;
        if (videoWidth > maxWidth) { videoHeight = (videoHeight * maxWidth) / videoWidth; videoWidth = maxWidth; }
        if (videoHeight > maxHeight) { videoWidth = (videoWidth * maxHeight) / videoHeight; videoHeight = maxHeight; }
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        const chunks: BlobPart[] = [];
        const stream = canvas.captureStream(30);
        const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp8", videoBitsPerSecond: 1000000 });
        mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "video/webm" });
          resolve(new File([blob], file.name.replace(/\.[^/.]+$/, ".webm"), { type: "video/webm" }));
          URL.revokeObjectURL(video.src);
        };
        const drawFrame = () => {
          if (video.ended || video.paused) { mediaRecorder.stop(); return; }
          ctx?.drawImage(video, 0, 0, videoWidth, videoHeight);
          requestAnimationFrame(drawFrame);
        };
        video.play();
        mediaRecorder.start();
        drawFrame();
        setTimeout(() => { video.pause(); mediaRecorder.stop(); }, Math.min(video.duration * 1000, 30000));
      };
      video.onerror = () => { URL.revokeObjectURL(video.src); reject(new Error("Video processing failed")); };
    });
  };

  useEffect(() => {
    return () => {
      previewImages.forEach(URL.revokeObjectURL);
      if (previewVideo) URL.revokeObjectURL(previewVideo);
    };
  }, [previewImages, previewVideo]);

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
    if (currentColor.trim()) {
      setProductData((prev) => ({ ...prev, colors: [...prev.colors, currentColor.trim()] }));
      setCurrentColor("");
      setShowColorPicker(false);
    }
  };

  const handleRemoveColor = (color: string) => {
    setProductData((prev) => ({ ...prev, colors: prev.colors.filter((c) => c !== color) }));
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setProductData((prev) => ({ ...prev, category: newCategory, sizes: newCategory !== "clothing" ? [] : prev.sizes }));
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const newFiles = Array.from(event.target.files) as File[];
    if (imageFiles.length + newFiles.length > 10) { alert("Maximum 10 images allowed"); return; }
    setImageFiles((prev) => [...prev, ...newFiles]);
    setPreviewImages((prev) => [...prev, ...newFiles.map(URL.createObjectURL)]);
  };

  const handleVideoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) return;
    const file = event.target.files[0];
    if (file.size > 100 * 1024 * 1024) { alert("Video must be less than 100MB"); return; }
    try {
      setVideoCompressing(true);
      const processed = file.size > 10 * 1024 * 1024 ? await compressVideo(file) : file;
      setVideoFile(processed);
      if (previewVideo) URL.revokeObjectURL(previewVideo);
      setPreviewVideo(URL.createObjectURL(processed));
    } catch {
      alert("Video processing failed. Try a smaller file.");
    } finally {
      setVideoCompressing(false);
    }
  };

  const uploadFilesToFirebase = async (files: File[], type: "images" | "video") => {
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    return Promise.all(
      files.map(async (file, i) => {
        const name = type === "video" ? `video_${ts}_${file.name}` : `image_${i}_${ts}_${file.name}`;
        const storageRef = ref(storage, `${type}/${name}`);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
      })
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!productData.name.trim()) { alert("Product name is required"); return; }
    if (!productData.regularPrice.toString().trim()) { alert("Regular price is required"); return; }
    if (!productData.category) { alert("Category is required"); return; }
    if (imageFiles.length === 0) { alert("At least one image is required"); return; }
    setIsUploading(true);
    try {
      const user = auth.currentUser;
      if (!user) { alert("You must be logged in"); setIsUploading(false); return; }
      const userSnap = await getDoc(doc(db, "users", user.uid));
      if (!userSnap.exists()) { alert("User profile not found"); setIsUploading(false); return; }
      const imageUrls = await uploadFilesToFirebase(imageFiles, "images");
      let videoUrl = "";
      if (videoFile) { [videoUrl] = await uploadFilesToFirebase([videoFile], "video"); }
      await addDoc(collection(db, "users", user.uid, "products"), { ...productData, images: imageUrls, video: videoUrl, createdAt: serverTimestamp() });
      alert("Product created successfully!");
      router.push("/store");
    } catch (error) {
      console.error(error);
      alert("Error creating product. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewImages[index]);
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    if (previewVideo) URL.revokeObjectURL(previewVideo);
    setPreviewVideo("");
    setVideoFile(null);
  };

  const busy = isUploading || videoCompressing;

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
            <h1 className="text-xl font-bold text-gray-900">Add New Product</h1>
            <p className="text-sm text-gray-500">Fill in the details to list your product</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Basic Info */}
          <Section icon={Type} title="Basic Information">
            <div className="space-y-4">
              <div>
                <label className={labelCls}>
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={productData.name}
                  onChange={handleInputChange}
                  disabled={busy}
                  className={inputCls}
                  placeholder="e.g. Blue Denim Jacket"
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <textarea
                  name="description"
                  value={productData.description}
                  onChange={handleInputChange}
                  disabled={busy}
                  className={`${inputCls} min-h-28 resize-none`}
                  placeholder="Describe your product — material, fit, features..."
                />
              </div>
            </div>
          </Section>

          {/* Pricing */}
          <Section icon={DollarSign} title="Pricing">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>
                  Regular Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="regularPrice"
                  value={productData.regularPrice}
                  onChange={handleInputChange}
                  disabled={busy}
                  className={inputCls}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Discount Price (₹)</label>
                <input
                  type="number"
                  name="discountPrice"
                  value={productData.discountPrice}
                  onChange={handleInputChange}
                  disabled={busy}
                  className={inputCls}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
            {productData.discountPrice && productData.regularPrice &&
              Number(productData.discountPrice) < Number(productData.regularPrice) && (
              <p className="mt-3 text-xs text-green-600 font-medium bg-green-50 px-3 py-2 rounded-lg">
                🎉 {Math.round(((Number(productData.regularPrice) - Number(productData.discountPrice)) / Number(productData.regularPrice)) * 100)}% discount applied
              </p>
            )}
          </Section>

          {/* Category & Sizes */}
          <Section icon={Grid3X3} title="Category & Sizes">
            <div className="space-y-4">
              <div>
                <label className={labelCls}>
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={productData.category}
                  onChange={handleCategoryChange}
                  disabled={busy}
                  className={inputCls}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="home">Home & Garden</option>
                  <option value="sports">Sports & Outdoors</option>
                  <option value="autoMobiles">Automobiles</option>
                  <option value="books">Books</option>
                  <option value="toys">Toys & Games</option>
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
                        disabled={busy}
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
                      <button type="button" onClick={() => handleRemoveColor(color)} className="text-gray-400 hover:text-red-500 transition-colors ml-1">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-10 h-10 rounded-xl border-2 border-gray-200 shadow-sm hover:border-primary/40 transition-colors"
                    style={{ backgroundColor: currentColor || "#ffffff" }}
                  />
                  {showColorPicker && (
                    <div className="absolute top-12 left-0 z-20">
                      <div className="fixed inset-0" onClick={() => setShowColorPicker(false)} />
                      <div className="relative z-10 shadow-xl rounded-xl overflow-hidden">
                        <ChromePicker color={currentColor} onChange={(c: ColorResult) => setCurrentColor(c.hex)} />
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  value={currentColor}
                  onChange={(e) => setCurrentColor(e.target.value)}
                  placeholder="#FF5733 or color name"
                  className={`${inputCls} flex-1`}
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
                {imageFiles.length < 10 && (
                  <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group">
                    <Plus className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                    <span className="text-[10px] text-gray-400 group-hover:text-primary mt-1">Add</span>
                    <input type="file" multiple accept="image/*" disabled={busy} onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Up to 10 images. <span className="font-medium">First image is the main photo.</span>
              </p>
            </div>
          </Section>

          {/* Video */}
          <Section icon={Video} title="Product Video (Optional)">
            <div className="space-y-3">
              {videoCompressing && (
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-3 rounded-xl text-sm font-medium">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  Compressing video...
                </div>
              )}
              {previewVideo ? (
                <div className="relative inline-block">
                  <video src={previewVideo} controls className="w-full max-w-xs h-40 object-cover rounded-xl border border-gray-200" />
                  <button
                    type="button"
                    onClick={removeVideo}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : !videoCompressing && (
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group">
                  <Video className="w-7 h-7 text-gray-400 group-hover:text-primary transition-colors mb-1" />
                  <span className="text-sm text-gray-500 group-hover:text-primary">Upload a video</span>
                  <span className="text-xs text-gray-400 mt-0.5">Max 100MB</span>
                  <input type="file" accept="video/*" disabled={busy} onChange={handleVideoUpload} className="hidden" />
                </label>
              )}
              <p className="text-xs text-gray-500">Videos over 10MB will be automatically compressed.</p>
            </div>
          </Section>

          {/* Options */}
          <Section icon={SlidersHorizontal} title="Product Options">
            <div className="divide-y divide-gray-50">
              <Toggle name="isInStock" checked={productData.isInStock} onChange={handleCheckboxChange} label="In Stock" description="Product is available for purchase" />
              <Toggle name="isFreeDelivery" checked={productData.isFreeDelivery} onChange={handleCheckboxChange} label="Free Delivery" description="Offer free shipping on this product" />
              <Toggle name="isMostSelling" checked={productData.isMostSelling} onChange={handleCheckboxChange} label="Most Selling" description="Mark as a top-selling product" />
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
                disabled={busy}
                className={inputCls}
                placeholder="summer, casual, cotton, blue..."
              />
              <p className="text-xs text-gray-500 mt-2">Separate tags with commas to help customers find your product.</p>
            </div>
          </Section>

          {/* Submit */}
          <button
            type="submit"
            disabled={busy}
            className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            style={{ background: busy ? "#9ca3af" : "linear-gradient(135deg, #6c64cb, #a78bfa)" }}
          >
            {isUploading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating Product...
              </span>
            ) : videoCompressing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing Video...
              </span>
            ) : (
              "Create Product"
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
