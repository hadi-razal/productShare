"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Plus, X } from "lucide-react";
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
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [videoCompressing, setVideoCompressing] = useState<boolean>(false);

  const router = useRouter();

  const compressVideo = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const video = document.createElement('video');
      
      video.src = URL.createObjectURL(file);
      video.muted = true;
      video.playsInline = true;
      
      video.onloadedmetadata = () => {
        const maxWidth = 720;
        const maxHeight = 480;
        let { videoWidth, videoHeight } = video;
        
        if (videoWidth > maxWidth) {
          videoHeight = (videoHeight * maxWidth) / videoWidth;
          videoWidth = maxWidth;
        }
        
        if (videoHeight > maxHeight) {
          videoWidth = (videoWidth * maxHeight) / videoHeight;
          videoHeight = maxHeight;
        }
        
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        
        const chunks: BlobPart[] = [];
        const stream = canvas.captureStream(30);
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp8',
          videoBitsPerSecond: 1000000
        });
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };
        
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webm'), {
            type: 'video/webm'
          });
          URL.revokeObjectURL(video.src);
          resolve(compressedFile);
        };
        
        const drawFrame = () => {
          if (video.ended || video.paused) {
            mediaRecorder.stop();
            return;
          }
          ctx?.drawImage(video, 0, 0, videoWidth, videoHeight);
          requestAnimationFrame(drawFrame);
        };
        
        video.play();
        mediaRecorder.start();
        drawFrame();
        
        setTimeout(() => {
          video.pause();
          mediaRecorder.stop();
        }, Math.min(video.duration * 1000, 30000));
      };
      
      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        reject(new Error('Video processing failed'));
      };
    });
  };

  useEffect(() => {
    return () => {
      previewImages.forEach(URL.revokeObjectURL);
      if (previewVideo) URL.revokeObjectURL(previewVideo);
    };
  }, [previewImages, previewVideo]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setProductData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSizeChange = (size: string) => {
    setProductData((prev) => {
      const newSizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: newSizes };
    });
  };

  const handleAddColor = () => {
    if (currentColor.trim()) {
      setProductData((prev) => ({
        ...prev,
        colors: [...prev.colors, currentColor.trim()],
      }));
      setCurrentColor("");
      setShowColorPicker(false);
    }
  };

  const handleRemoveColor = (colorToRemove: string) => {
    setProductData((prev) => ({
      ...prev,
      colors: prev.colors.filter((color) => color !== colorToRemove),
    }));
  };

  const handleColorPickerChange = (color: ColorResult) => {
    setCurrentColor(color.hex);
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setProductData((prev) => ({
      ...prev,
      category: newCategory,
      sizes: newCategory !== "clothing" ? [] : prev.sizes,
    }));
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files) as File[];
      const totalImages = imageFiles.length + newFiles.length;
      
      if (totalImages > 10) {
        alert("You can upload maximum 10 images");
        return;
      }
      
      setImageFiles((prev) => [...prev, ...newFiles]);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewImages((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleVideoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      if (file.size > 100 * 1024 * 1024) {
        alert("Video file size must be less than 100MB");
        return;
      }

      try {
        setVideoCompressing(true);
        
        let processedFile = file;
        if (file.size > 10 * 1024 * 1024) {
          processedFile = await compressVideo(file);
        }

        setVideoFile(processedFile);

        if (previewVideo) URL.revokeObjectURL(previewVideo);
        setPreviewVideo(URL.createObjectURL(processedFile));
      } catch (err) {
        console.error("Error processing video:", err);
        alert("Video processing failed. Try a smaller file.");
      } finally {
        setVideoCompressing(false);
      }
    }
  };

  const uploadFilesToFirebase = async (files: File[], type: "images" | "video") => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(
      2,
      "0"
    )}_${String(currentDate.getHours()).padStart(2, "0")}-${String(
      currentDate.getMinutes()
    ).padStart(2, "0")}-${String(currentDate.getSeconds()).padStart(2, "0")}`;

    const uploadPromises = files.map(async (file, index) => {
      const fileName = type === "video" ? `video_${formattedDate}_${file.name}` : `image_${index}_${formattedDate}_${file.name}`;
      const storageRef = ref(storage, `${type}/${fileName}`);
      await uploadBytes(storageRef, file);
      return getDownloadURL(storageRef);
    });

    return await Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!productData.name.trim()) {
      alert("Product name is required");
      return;
    }
    
    if (!productData.regularPrice.trim()) {
      alert("Regular price is required");
      return;
    }
    
    if (!productData.category) {
      alert("Category is required");
      return;
    }
    
    if (imageFiles.length === 0) {
      alert("At least one image is required");
      return;
    }

    if (imageFiles.length > 10) {
      alert("Maximum 10 images allowed");
      return;
    }

    setIsUploading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to create a product");
        setIsUploading(false);
        return;
      }

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (!userDocSnap.exists()) {
        alert("User profile not found");
        setIsUploading(false);
        return;
      }

      const imageUrls = await uploadFilesToFirebase(imageFiles, "images");
      
      let videoUrl = "";
      if (videoFile) {
        const videoUrls = await uploadFilesToFirebase([videoFile], "video");
        videoUrl = videoUrls[0];
      }

      const productToSave = {
        ...productData,
        images: imageUrls,
        video: videoUrl,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "users", user.uid, "products"), productToSave);
      
      alert("Product created successfully!");
      router.push("/store");
      
    } catch (error) {
      console.error("Error creating product:", error);
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

  return (
    <div className="w-full max-w-3xl mx-auto px-3 pb-10 pt-7 relative">
      <h2 className="text-2xl font-bold mb-6">Create New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            disabled={isUploading}
            name="name"
            value={productData.name}
            onChange={handleInputChange}
            className="block w-full bg-gray-200 p-3 border focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            disabled={isUploading}
            value={productData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 min-h-20 border bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            placeholder="Enter product description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Regular Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              disabled={isUploading}
              name="regularPrice"
              value={productData.regularPrice}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Discount Price</label>
            <input
              type="number"
              disabled={isUploading}
              name="discountPrice"
              value={productData.discountPrice}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            disabled={isUploading}
            value={productData.category}
            onChange={handleCategoryChange}
            className="block w-full bg-gray-200 p-3 border focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
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
          <div className="space-y-2">
            <label className="block text-sm font-medium">Available Sizes</label>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  disabled={isUploading}
                  onClick={() => handleSizeChange(size)}
                  className={`px-4 py-2 border rounded-md transition-colors ${
                    productData.sizes.includes(size)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium">Available Colors</label>
          <div className="space-y-3">
            {productData.colors.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {productData.colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm">{color}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(color)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-10 h-10 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: currentColor || "#ffffff" }}
                />
                {showColorPicker && (
                  <div className="absolute top-12 left-0 z-10">
                    <div 
                      className="fixed inset-0" 
                      onClick={() => setShowColorPicker(false)}
                    />
                    <ChromePicker
                      color={currentColor}
                      onChange={handleColorPickerChange}
                    />
                  </div>
                )}
              </div>
              <input
                type="text"
                value={currentColor}
                onChange={(e) => setCurrentColor(e.target.value)}
                placeholder="#000000 or color name"
                className="px-3 py-2 border bg-gray-200 rounded-md flex-1"
              />
              <button
                type="button"
                onClick={handleAddColor}
                disabled={!currentColor.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Product Images <span className="text-red-500">*</span> (Max: 10)
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {previewImages.map((image, index) => (
              <div key={index} className="relative w-24 h-24">
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {imageFiles.length < 10 && (
              <label className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400 hover:bg-gray-50">
                <Plus className="w-8 h-8 text-gray-400" />
                <input
                  disabled={isUploading}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Upload up to 10 images. The first image will be the main product image.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Product Video (Optional)</label>
          {videoCompressing && (
            <div className="text-sm text-blue-600">Compressing video, please wait...</div>
          )}
          <div className="flex flex-wrap gap-2 mb-4">
            {previewVideo && (
              <div className="relative w-48 h-28">
                <video
                  src={previewVideo}
                  controls
                  className="w-full h-full object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={removeVideo}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {!previewVideo && !videoCompressing && (
              <label className="flex items-center justify-center w-48 h-28 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400 hover:bg-gray-50">
                <Plus className="w-8 h-8 text-gray-400" />
                <input
                  disabled={isUploading || videoCompressing}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Upload one video file. Maximum size: 100MB. Videos larger than 10MB will be compressed.
          </p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium">Additional Options</label>
          <div className="flex flex-col space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isInStock"
                checked={productData.isInStock}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              In Stock
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isFreeDelivery"
                checked={productData.isFreeDelivery}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              Free Delivery
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isMostSelling"
                checked={productData.isMostSelling}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              Most Selling Product
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Tags</label>
          <input
            type="text"
            disabled={isUploading}
            name="tags"
            value={productData.tags}
            onChange={handleInputChange}
            className="block w-full bg-gray-200 p-3 border focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            placeholder="Enter tags separated by commas (e.g., summer, casual, cotton)"
          />
        </div>

        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
            isUploading || videoCompressing
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={isUploading || videoCompressing}
        >
          {isUploading ? "Creating Product..." : videoCompressing ? "Processing Video..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;