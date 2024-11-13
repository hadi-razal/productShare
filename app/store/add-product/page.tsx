"use client"

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Plus, Router, X } from 'lucide-react';
import { addDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/lib/firebase';
import { ProductType } from '@/type';
import { useRouter } from 'next/navigation';


const CreateProduct = () => {
    const [productData, setProductData] = useState<ProductType>({
        name: '',
        description: '',
        regularPrice: '',
        discountPrice: '',
        colors: [],
        category: '',
        sizes: [],
        isInStock: true,
        images: [],
        tags: '',
        views: 0,
        isFreeDelivery: false,
        isMostSelling: false
    });

    const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
    const [currentColor, setCurrentColor] = useState('');
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const router = useRouter()

    useEffect(() => {
        return () => {
            previewImages.forEach(URL.revokeObjectURL);
        };
    }, [previewImages]);

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
            sizes: newCategory !== 'clothing' ? [] : prev.sizes // Reset sizes if category is not clothing
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
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}_${String(currentDate.getHours()).padStart(2, '0')}-${String(currentDate.getMinutes()).padStart(2, '0')}-${String(currentDate.getSeconds()).padStart(2, '0')}`;
        try {
            const uploadPromises = imageFiles.map(async (file) => {
                const storageRef = ref(storage, `products/${formattedDate}_${file.name}`);
                await uploadBytes(storageRef, file);
                return getDownloadURL(storageRef);
            });
            const urls = await Promise.all(uploadPromises);
            return urls;
        } catch (error) {
            console.error("Error uploading images:", error);
            throw error;
        }
    };
    
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userDocRef = doc(db, "users", user.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        try {
                            const imageUrls = await uploadImagesToFirebase();
                            await addDoc(collection(db, `${user.uid}`), {
                                ...productData,
                                images: imageUrls,
                                createdAt: serverTimestamp(),
                            });
                            console.log('Product Data:', productData);
                            router.push('/store')
                        } catch (error) {
                            console.error('Error adding document:', error);
                        }
                    } else {
                        console.log('User document does not exist');
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                console.log('No user is signed in.');
            }
            setIsUploading(false);
        });
    };

    const removeImage = (index: number) => {
        URL.revokeObjectURL(previewImages[index]);
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-3 pb-10 pt-24">
            <div>
                <h2 className="text-2xl font-bold mb-6">Create New Product</h2>
            </div>
            <div className='space-y-6'>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Product Name */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Product Name</label>
                        <input type="text" disabled={isUploading} name="name" value={productData.name} onChange={handleInputChange} className="block w-full bg-gray-200 p-3 border focus:outline-none rounded-md"
                            placeholder="Enter product name" />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Description</label>
                        <textarea name="description" disabled={isUploading} value={productData.description} onChange={handleInputChange} className="w-full px-3 py-2 min-h-20  border bg-gray-200 focus:outline-none rounded-md" placeholder="Enter product description" />
                    </div>

                    {/* Pricing */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Regular Price</label>
                        <input type="text" disabled={isUploading} name="regularPrice" value={productData.regularPrice} onChange={handleInputChange} className="w-full px-3 py-2 border bg-gray-200 rounded-md" placeholder="₹0.00" />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Discount Price</label>
                        <input disabled={isUploading} type="text" name="discountPrice" value={productData.discountPrice} onChange={handleInputChange} className="block w-full bg-gray-200 p-3 border focus:outline-none rounded-md" placeholder="₹0.00" />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Category</label>
                        <select name="category" disabled={isUploading} value={productData.category} onChange={handleCategoryChange} className="block w-full bg-gray-200 p-3 border focus:outline-none rounded-md">
                            <option value="">Select a category</option>
                            <option value="electronics">Electronics</option>
                            <option value="clothing">Clothing</option>
                            <option value="home">Home</option>
                            <option value="sports">Sports</option>
                            <option value="autoMobiles">Auto Mobiles</option>
                        </select>
                    </div>

                    {/* Sizes (Only show when category is clothing) */}
                    {productData.category === 'clothing' && (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Available Sizes</label>
                            <div className="flex flex-wrap gap-2">
                                {availableSizes.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => handleSizeChange(size)}
                                        className={`px-4 py-2 border rounded-md ${productData.sizes.includes(size)
                                            ? 'bg-gray-950 text-white'
                                            : 'bg-gray-200 text-gray-700'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* In Stock Toggle */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">In Stock</label>
                        <input type="checkbox" name="isInStock" checked={productData.isInStock} onChange={handleCheckboxChange} className="mr-2" />
                    </div>

                    {/* Colors */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Color (optional)</label>
                        <div className='flex items-center justify-center pb-3'>
                            <input disabled={isUploading} type="text" value={currentColor} onChange={(e) => setCurrentColor(e.target.value)} placeholder="enter color code eg:#fefefe" className="w-2/3 px-3 py-2 border focus:outline-none rounded-l-md bg-gray-200" />
                            <button type="button" onClick={handleAddColor} className="text-sm w-1/3 font-medium px-3 py-3 text-white rounded-r-md bg-blue-950">Add Color</button>
                        </div>

                        {/* Display added colors */}
                        <div className='flex items-center gap-2 justify-start flex-wrap'>
                            {productData.colors.map((color, index) => (
                                <span key={index} style={{ background: color }} className="relative cursor-pointer h-[35px] w-[35px] rounded-[50%] flex items-center justify-center shadow-lg" />
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Tags</label>
                        <input type="text" disabled={isUploading} name='tags' value={productData.tags} onChange={handleInputChange} placeholder="Add tags" className="block w-full bg-gray-200 p-3 border focus:outline-none rounded-md" />
                    </div>

                    {/* Featured and Most Selling Toggles */}
                    <div className='flex space-x-4'>
                        <div className='flex items-center'>
                            <input type='checkbox' name='isMostSelling' checked={productData.isMostSelling} onChange={handleCheckboxChange} id='most-selling' />
                            <label htmlFor='most-selling' className='ml-2'>Most Selling</label>
                        </div>
                        <div className='flex items-center'>
                            <input type='checkbox' name='isFreeDelivery' checked={productData.isFreeDelivery} onChange={handleCheckboxChange} id='free-delivery' />
                            <label htmlFor='free-delivery' className='ml-2'>Free Delivery</label>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium">Product Images</label>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {previewImages.map((image, index) => (
                                <div key={index} className="relative w-24 h-24">
                                    <img src={image} alt={`Product ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                                    <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 text-gray-500 hover:text-red-500">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}

                            <label className="flex items-center justify-center w-24 h-24 border rounded-md cursor-pointer hover:bg-gray-200">
                                <Plus className="w-8 h-8 text-gray-400" />
                                <input disabled={isUploading} type='file' multiple onChange={handleImageUpload} className='hidden' />
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className={`w-full py-2 px-4 rounded-md text-white ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-950'}`}
                            disabled={isUploading}
                        >
                            {isUploading ? 'Creating...' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProduct;