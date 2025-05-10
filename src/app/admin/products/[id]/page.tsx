// src/app/admin/products/[id]/page.tsx
"use client"

import { useState, useEffect, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface ProductFormData {
  name: string;
  brand: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  inStock: boolean;
  category: string;
  frameType?: string;
  gender?: string;
  images: string[];
  features: string[];
  colors: {
    name: string;
    code: string;
  }[];
  sizes: {
    size: string;
    description: string;
  }[];
  rating: number;
  reviewCount: number;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === 'new';
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    brand: '',
    description: '',
    price: 0,
    compareAtPrice: 0,
    stockQuantity: 0,
    inStock: true,
    category: 'eyeglasses',
    frameType: 'full-rim',
    gender: 'unisex',
    images: [],
    features: [],
    colors: [],
    sizes: [],
    rating: 5,
    reviewCount: 0
  });
  
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [newColor, setNewColor] = useState({ name: '', code: '' });
  const [newSize, setNewSize] = useState({ size: '', description: '' });
  const [newFeature, setNewFeature] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  useEffect(() => {
    if (isNew) return;
    
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/products/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        
        const product = await response.json();
        
        setFormData({
          ...product,
          compareAtPrice: product.compareAtPrice || 0,
          features: product.features || [],
          colors: product.colors || [],
          sizes: product.sizes || [],
          images: product.images || [],
        });
      } catch (err: any) {
        setError(err.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [params.id, isNew]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value
    });
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: checked
    });
  };
  
  // Feature management
  const addFeature = () => {
    if (!newFeature) return;
    setFormData({
      ...formData,
      features: [...formData.features, newFeature]
    });
    setNewFeature('');
  };
  
  const removeFeature = (index: number) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures.splice(index, 1);
    setFormData({
      ...formData,
      features: updatedFeatures
    });
  };
  
  // Color management
  const addColor = () => {
    if (!newColor.name || !newColor.code) return;
    setFormData({
      ...formData,
      colors: [...formData.colors, { ...newColor }]
    });
    setNewColor({ name: '', code: '' });
  };
  
  const removeColor = (index: number) => {
    const updatedColors = [...formData.colors];
    updatedColors.splice(index, 1);
    setFormData({
      ...formData,
      colors: updatedColors
    });
  };
  
  // Size management
  const addSize = () => {
    if (!newSize.size || !newSize.description) return;
    setFormData({
      ...formData,
      sizes: [...formData.sizes, { ...newSize }]
    });
    setNewSize({ size: '', description: '' });
  };
  
  const removeSize = (index: number) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes.splice(index, 1);
    setFormData({
      ...formData,
      sizes: updatedSizes
    });
  };
  
  // Image management
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };
  
  const uploadImage = async () => {
    if (!imageFile) return;
    
    try {
      setUploadingImage(true);
      
      const formData = new FormData();
      formData.append('file', imageFile);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, data.url]
      }));
      
      setImageFile(null);
      
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };
  
  const addImageUrl = () => {
    if (!imageUrl) return;
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imageUrl]
    }));
    
    setImageUrl('');
  };
  
  const removeImage = (index: number) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      images: updatedImages
    });
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Prepare the data
      const productData = {
        ...formData,
        compareAtPrice: formData.compareAtPrice && formData.compareAtPrice > 0 
          ? formData.compareAtPrice 
          : null
      };
      
      const url = isNew 
        ? '/api/admin/products' 
        : `/api/admin/products/${params.id}`;
      
      const method = isNew ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save product');
      }
      
      router.push('/admin/products');
      
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isNew ? 'Add New Product' : 'Edit Product'}
        </h1>
        <Link
          href="/admin/products"
          className="text-indigo-600 hover:text-indigo-800"
        >
          Back to Products
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        {/* Basic Information */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4 pb-2 border-b">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                Brand *
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="eyeglasses">Eyeglasses</option>
                <option value="sunglasses">Sunglasses</option>
                <option value="contact-lenses">Contact Lenses</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="frameType" className="block text-sm font-medium text-gray-700 mb-1">
                Frame Type
              </label>
              <select
                id="frameType"
                name="frameType"
                value={formData.frameType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="full-rim">Full Rim</option>
                <option value="half-rim">Half Rim</option>
                <option value="rimless">Rimless</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="unisex">Unisex</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Price and Inventory */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4 pb-2 border-b">Price & Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price (€) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            
            <div>
              <label htmlFor="compareAtPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Compare-at Price (€)
              </label>
              <input
                type="number"
                id="compareAtPrice"
                name="compareAtPrice"
                value={formData.compareAtPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            
            <div>
              <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                id="stockQuantity"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                required
                min="0"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            
            <div>
              <div className="flex items-center h-full">
                <input
                  type="checkbox"
                  id="inStock"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label htmlFor="inStock" className="ml-2 block text-sm text-gray-700">
                  In Stock
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4 pb-2 border-b">Features</h2>
          
          <ul className="list-disc list-inside mb-4">
            {formData.features.map((feature, index) => (
              <li key={index} className="flex items-center justify-between mb-2">
                <span>{feature}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="text-red-600 hover:text-red-800 ml-2"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Add a feature"
              className="flex-grow border border-gray-300 rounded px-3 py-2"
            />
            <button
              type="button"
              onClick={addFeature}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
        </div>
        
        {/* Colors */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4 pb-2 border-b">Colors</h2>
          
          <div className="grid grid-cols-4 gap-4 mb-4">
            {formData.colors.map((color, index) => (
              <div key={index} className="border border-gray-200 rounded p-3 flex flex-col items-center">
                <div 
                  className="w-8 h-8 rounded-full mb-2" 
                  style={{ backgroundColor: color.code }}
                ></div>
                <span className="text-sm mb-2">{color.name}</span>
                <button
                  type="button"
                  onClick={() => removeColor(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="colorName" className="block text-sm font-medium text-gray-700 mb-1">
                Color Name
              </label>
              <input
                type="text"
                id="colorName"
                value={newColor.name}
                onChange={(e) => setNewColor({...newColor, name: e.target.value})}
                placeholder="e.g. Black, Gold, Blue"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="colorCode" className="block text-sm font-medium text-gray-700 mb-1">
                Color Code
              </label>
              <input
                type="color"
                id="colorCode"
                value={newColor.code}
                onChange={(e) => setNewColor({...newColor, code: e.target.value})}
                className="w-full h-10 border border-gray-300 rounded px-1 py-1"
              />
            </div>
          </div>
          
          <button
            type="button"
            onClick={addColor}
            className="mt-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Add Color
          </button>
        </div>
        
        {/* Sizes */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4 pb-2 border-b">Sizes</h2>
          
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formData.sizes.map((size, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap">{size.size}</td>
                    <td className="px-4 py-2">{size.description}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => removeSize(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="sizeValue" className="block text-sm font-medium text-gray-700 mb-1">
                Size
              </label>
              <input
                type="text"
                id="sizeValue"
                value={newSize.size}
                onChange={(e) => setNewSize({...newSize, size: e.target.value})}
                placeholder="e.g. Small, Medium, Large"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="sizeDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                id="sizeDescription"
                value={newSize.description}
                onChange={(e) => setNewSize({...newSize, description: e.target.value})}
                placeholder="e.g. 52mm lens width"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>
          
          <button
            type="button"
            onClick={addSize}
            className="mt-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Add Size
          </button>
        </div>
        
        {/* Images */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4 pb-2 border-b">Images</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative border border-gray-200 rounded overflow-hidden">
                <img 
                  src={image} 
                  alt={`Product ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Upload Image</h3>
            <div className="flex space-x-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-grow border border-gray-300 rounded px-3 py-2"
              />
              <button
                type="button"
                onClick={uploadImage}
                disabled={!imageFile || uploadingImage}
                className={`px-4 py-2 rounded ${
                  !imageFile || uploadingImage
                    ? 'bg-gray-300 text-gray-500'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {uploadingImage ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Image URL</h3>
            <div className="flex space-x-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-grow border border-gray-300 rounded px-3 py-2"
              />
              <button
                type="button"
                onClick={addImageUrl}
                disabled={!imageUrl}
                className={`px-4 py-2 rounded ${
                  !imageUrl
                    ? 'bg-gray-300 text-gray-500'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                Add
              </button>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <Link
            href="/admin/products"
            className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-2 rounded ${
              saving
                ? 'bg-indigo-400 text-white cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {saving 
              ? 'Saving...' 
              : isNew 
                ? 'Create Product' 
                : 'Update Product'
            }
          </button>
        </div>
      </form>
    </div>
  );
}