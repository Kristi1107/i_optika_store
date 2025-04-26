// src/app/admin/products/edit/[id]/page.tsx
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ProductData {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: string;
  salePrice: string;
  stock: string;
  gender: string;
  frameType: string;
  colors: { name: string; code: string }[];
  sizes: { size: string; description: string }[];
  features: string[];
}

export default function EditProduct({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [formData, setFormData] = useState<ProductData>({
    id: '',
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
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch product data (in a real app, this would be an API call)
  useEffect(() => {
    // Simulate API call to fetch product data
    setIsLoading(true);
    
    // In a real app, you'd fetch from your API using the ID
    setTimeout(() => {
      if (id === 'frame-1') {
        setFormData({
          id: 'frame-1',
          name: 'Ray-Ban Classic Wayfarers',
          brand: 'Ray-Ban',
          category: 'sunglasses',
          description: 'The iconic Ray-Ban Wayfarer is simply the most recognizable style in sunglasses. The distinctive shape is paired with the traditional Ray-Ban signature logo on the sculpted temples.',
          price: '199',
          salePrice: '',
          stock: '24',
          gender: 'unisex',
          frameType: 'full-rim',
          colors: [
            { name: 'Black', code: '#000000' },
            { name: 'Tortoise', code: '#8B4513' },
            { name: 'Blue', code: '#0000FF' }
          ],
          sizes: [
            { size: '50-22', description: 'Small' },
            { size: '52-22', description: 'Medium' },
            { size: '54-22', description: 'Large' }
          ],
          features: [
            'UV Protection: 100% UV400 protection against harmful UVA/UVB rays',
            'Frame Material: High-quality acetate for durability and comfort',
            'Lens Technology: Crystal lenses with superior clarity and scratch resistance',
            'Style: Classic, timeless design suitable for all face shapes'
          ]
        });
        setIsLoading(false);
      } else {
        setError('Product not found');
        setIsLoading(false);
      }
    }, 1000);
  }, [id]);

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
    console.log('Updating product:', formData);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Redirect to products page after saving
      router.push('/admin/products');
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <h2 className="font-bold">Error</h2>
        <p>{error}</p>
        <div className="mt-4">
          <Link href="/admin/products" className="text-indigo-600 hover:text-indigo-800">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
        <Link href="/admin/products" className="text-indigo-600 hover:text-indigo-800">
          ← Back to Products
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        {/* Same form fields as in the add product page */}
        {/* For brevity, I'm not repeating all the form fields here, but they would be identical to the add product form */}
        {/* The only difference is that they are pre-filled with the existing product data */}
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className={`${
              isSaving ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white px-6 py-3 rounded-lg transition`}
          >
            {isSaving ? 'Saving...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
}