"use client"

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Plus, X } from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { db, storage } from '@/lib/firebase';
import { getUserId } from '@/helpers/getUserId';

interface ProductData {
    name: string;
    description: string;
    regularPrice: string;
    discountPrice: string;
    colors: string[];
    category: string;
    sizes: string[];
    isInStock: boolean;
    availableStock: string;
    images: string[];
    tags: string;
    isFeatured: boolean;
    isMostSelling: boolean;
    createdAt?: Date;
}

const EditProduct = () => {
    const router = useRouter();
    const { storeId, productId } = useParams()
    const [productData, setProductData] = useState<ProductData>({
        name: '',
        description: '',
        regularPrice: '',
        discountPrice: '',
        colors: [],
        category: '',
        sizes: [],
        isInStock: true,
        availableStock: '',
        images: [],
        tags: '',
        isFeatured: false,
        isMostSelling: false
    });

    const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
    const [currentColor, setCurrentColor] = useState('');
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isloading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {

        const fetchProduct = async () => {
            setIsLoading(true)
            const userId = await getUserId(storeId as string)
            if (!userId) {
                setIsLoading(false)

                console.log("no user id found")
            }
            if (!productId) {
                setIsLoading(false)
                console.log("no product id found")
            }
            const productRef = doc(db, userId, productId as string);
            const productSnap = await getDoc(productRef);

            if (productSnap.exists()) {
                const data = productSnap.data() as ProductData;
                setProductData(data);
                setPreviewImages(data.images || []);
                setIsLoading(false)
            } else {
                setIsLoading(false)
                console.log("No such document!");
            }
        };

        fetchProduct();
    }, [productId]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProductData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setProductData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSizeChange = (size: string) => {
        setProductData(prev => {
            const newSizes = prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size];
            return { ...prev, sizes: newSizes };
        });
    };

    const handleAddColor = () => {
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if (currentColor.trim()) {
            if (hexRegex.test(currentColor.trim())) {
                setProductData(prev => ({ ...prev, colors: [...prev.colors, currentColor.trim()] }));
                setCurrentColor('');
            } else {
                console.log("Please enter a valid hex color code (e.g., #FF0000 or #F00)");
            }
        }
    };

    const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newCategory = e.target.value;
        setProductData(prev => ({
            ...prev,
            category: newCategory,
            sizes: newCategory !== 'clothing' ? [] : prev.sizes
        }));
    };

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files) as File[];
            const updatedFiles = [...imageFiles, ...newFiles];
            setImageFiles(updatedFiles);
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setPreviewImages(prev => [...prev, ...newPreviews]);
        }
    };

    const uploadImagesToFirebase = async () => {
        const urls: string[] = [];
        for (const file of imageFiles) {
            const storageRef = ref(storage, `products/${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            urls.push(downloadURL);
        }
        return urls;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            const userId = await getUserId(storeId as string)

            if (!userId) {
                console.log("no user id found")
            }

            const imageUrls = await uploadImagesToFirebase();
            const updatedData = {
                ...productData,
                images: [...productData.images, ...imageUrls]
            };

            const productRef = doc(db, userId, productId as string);
            await updateDoc(productRef, updatedData);
            console.log('Product updated successfully!');
            router.push('/products');
        } catch (error) {
            console.log("Error updating product:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = (index: number) => {
        URL.revokeObjectURL(previewImages[index]);
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };



    if (isloading) return (
        <div className='flex items-center justify-center h-[calc(100vh-90px)]'>
            <p className='text-lg text-gray-400 animate-pulse'>Loading product details...</p>
        </div>
    )

    return (
        <div className="w-full max-w-4xl mx-auto px-3 pb-10 pt-24">
            <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Name */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={productData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border bg-gray-200 rounded-md"
                        placeholder="Enter product name"
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        value={productData.description}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border bg-gray-200 rounded-md"
                        placeholder="Enter product description"
                    />
                </div>

                {/* Regular Price */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Regular Price</label>
                    <input
                        type="number"
                        name="regularPrice"
                        value={productData.regularPrice}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border bg-gray-200 rounded-md"
                        placeholder="Enter regular price"
                    />
                </div>

                {/* Discount Price */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Discount Price</label>
                    <input
                        type="number"
                        name="discountPrice"
                        value={productData.discountPrice}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border bg-gray-200 rounded-md"
                        placeholder="Enter discount price"
                    />
                </div>

                {/* Category */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Category</label>
                    <select
                        name="category"
                        value={productData.category}
                        onChange={handleCategoryChange}
                        className="w-full px-3 py-2 border bg-gray-200 rounded-md"
                    >
                        <option value="">Select Category</option>
                        <option value="clothing">Clothing</option>
                        <option value="accessories">Accessories</option>
                        <option value="footwear">Footwear</option>
                    </select>
                </div>

                {/* Sizes */}
                {productData.category === 'clothing' && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Sizes</label>
                        <div className="flex flex-wrap gap-2">
                            {availableSizes.map(size => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => handleSizeChange(size)}
                                    className={`px-3 py-1 rounded-md ${productData.sizes.includes(size) ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Colors */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Colors</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={currentColor}
                            onChange={(e) => setCurrentColor(e.target.value)}
                            className="w-full px-3 py-2 border bg-gray-200 rounded-md"
                            placeholder="Enter color hex code"
                        />
                        <button
                            type="button"
                            onClick={handleAddColor}
                            className="px-4 py-2 bg-green-500 text-white rounded-md"
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex gap-2 mt-2">
                        {productData.colors.map((color, index) => (
                            <div key={index} className="flex items-center gap-1">
                                <span style={{ backgroundColor: color }} className="w-6 h-6 rounded-full border" />
                                <button
                                    type="button"
                                    onClick={() => setProductData(prev => ({
                                        ...prev,
                                        colors: prev.colors.filter(c => c !== color)
                                    }))}
                                    className="text-red-500"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Tags</label>
                    <input
                        type="text"
                        name="tags"
                        value={productData.tags}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border bg-gray-200 rounded-md"
                        placeholder="Enter tags, separated by commas"
                    />
                </div>

                {/* Stock Availability */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Available Stock</label>
                    <input
                        type="number"
                        name="availableStock"
                        value={productData.availableStock}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border bg-gray-200 rounded-md"
                        placeholder="Enter available stock quantity"
                    />
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Images</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleImageUpload}
                        className="w-full px-3 py-2 border bg-gray-200 rounded-md"
                    />
                    <div className="flex gap-2 mt-2">
                        {previewImages.map((image, index) => (
                            <div key={index} className="relative">
                                <img src={image} alt="preview" className="w-20 h-20 object-cover rounded-md" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="isFeatured"
                            checked={productData.isFeatured}
                            onChange={handleCheckboxChange}
                            className="form-checkbox"
                        />
                        <span>Featured</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="isMostSelling"
                            checked={productData.isMostSelling}
                            onChange={handleCheckboxChange}
                            className="form-checkbox"
                        />
                        <span>Best Selling</span>
                    </label>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        className={`w-full py-2 px-4 rounded-md text-white ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'}`}
                        disabled={isUploading}
                    >
                        {isUploading ? 'Updating...' : 'Update Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;
