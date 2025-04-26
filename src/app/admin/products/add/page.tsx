// src/app/admin/products/add/page.tsx
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddProduct() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'eyeglasses',
    description: '',
    price: '',
    salePrice: '',
    stock: '',
    gender: 'unisex',
    frameType: 'full-rim',
    colors: [{ name: '', code: '' }],
    sizes: [{ size: '', description: '' }],
    features: ['']
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleColorChange = (index: number, field: string, value: string) => {
    const updatedColors = [...formData.colors];
    updatedColors[index] = { ...updatedColors[index], [field]: value };
    setFormData({
      ...formData,
      colors: updatedColors
    });
  };

  const addColor = () => {
    setFormData({
      ...formData,
      colors: [...formData.colors, { name: '', code: '' }]
    });
  };

  const removeColor = (index: number) => {
    const updatedColors = [...formData.colors];
    updatedColors.splice(index, 1);
    setFormData({
      ...formData,
      colors: updatedColors
    });
  };

  const handleSizeChange = (index: number, field: string, value: string) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes[index] = { ...updatedSizes[index], [field]: value };
    setFormData({
      ...formData,
      sizes: updatedSizes
    });
  };

  const addSize = () => {
    setFormData({
      ...formData,
      sizes: [...formData.sizes, { size: '', description: '' }]
    });
  };

  const removeSize = (index: number) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes.splice(index, 1);
    setFormData({
      ...formData,
      sizes: updatedSizes
    });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData({
      ...formData,
      features: updatedFeatures
    });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    });
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures.splice(index, 1);
    setFormData({
      ...formData,
      features: updatedFeatures
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // In a real app, you would submit to your backend API
    console.log('Submitting product:', formData);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Redirect to products page after saving
      router.push('/admin/products');
    }, 1000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
        <Link href="/admin/products" className="text-indigo-600 hover:text-indigo-800">
          ← Back to Products
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
              Brand*
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              required
              value={formData.brand}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category*
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="eyeglasses">Eyeglasses</option>
              <option value="sunglasses">Sunglasses</option>
              <option value="contact-lenses">Contact Lenses</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price* ($)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700 mb-1">
              Sale Price ($)
            </label>
            <input
              type="number"
              id="salePrice"
              name="salePrice"
              min="0"
              step="0.01"
              value={formData.salePrice}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity*
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              required
              min="0"
              value={formData.stock}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
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
              <option value="kids">Kids</option>
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
              <option value="shield">Shield</option>
              <option value="n/a">Not Applicable</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Product Description*
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          ></textarea>
        </div>

        {/* Color Options */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Color Options
          </label>
          {formData.colors.map((color, index) => (
            <div key={index} className="flex gap-4 mb-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Color Name (e.g., Black)"
                  value={color.name}
                  onChange={(e) => handleColorChange(index, 'name', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Color Code (e.g., #000000)"
                  value={color.code}
                  onChange={(e) => handleColorChange(index, 'code', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <button
                type="button"
                onClick={() => removeColor(index)}
                className="bg-red-100 text-red-600 px-3 py-2 rounded hover:bg-red-200"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addColor}
            className="mt-2 text-indigo-600 hover:text-indigo-800"
          >
            + Add Another Color
          </button>
        </div>

        {/* Size Options */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Size Options
          </label>
          {formData.sizes.map((size, index) => (
            <div key={index} className="flex gap-4 mb-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Size (e.g., 52-18)"
                  value={size.size}
                  onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Description (e.g., Medium)"
                  value={size.description}
                  onChange={(e) => handleSizeChange(index, 'description', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <button
                type="button"
                onClick={() => removeSize(index)}
                className="bg-red-100 text-red-600 px-3 py-2 rounded hover:bg-red-200"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSize}
            className="mt-2 text-indigo-600 hover:text-indigo-800"
          >
            + Add Another Size
          </button>
        </div>

        {/* Features */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Product Features
          </label>
          {formData.features.map((feature, index) => (
            <div key={index} className="flex gap-4 mb-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Feature (e.g., UV Protection: 100% UV400 protection)"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="bg-red-100 text-red-600 px-3 py-2 rounded hover:bg-red-200"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addFeature}
            className="mt-2 text-indigo-600 hover:text-indigo-800"
          >
            + Add Another Feature
          </button>
        </div>

        {/* Image Upload - In a real app, you would handle file uploads */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Product Images
          </label>
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
            <div className="mb-3">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-500 mb-2">Drag and drop image files here, or click to select files</p>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Select Files
            </button>
            <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className={`${
              isSaving ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white px-6 py-3 rounded-lg transition`}
          >
            {isSaving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}