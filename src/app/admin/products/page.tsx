// src/app/admin/products/page.tsx
"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  salePrice: number | null;
  inStock: boolean;
  stockQuantity: number;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isAscending, setIsAscending] = useState(true);

  // Simulate fetching products from an API
  useEffect(() => {
    // In a real app, you would fetch from your API
    const mockProducts: Product[] = [
      { id: 'frame-1', name: 'Ray-Ban Classic Wayfarers', brand: 'Ray-Ban', category: 'sunglasses', price: 199, salePrice: null, inStock: true, stockQuantity: 24 },
      { id: 'frame-2', name: 'Oakley Rectangle Frames', brand: 'Oakley', category: 'eyeglasses', price: 249, salePrice: 199, inStock: true, stockQuantity: 15 },
      { id: 'frame-3', name: 'Prada Designer Sunglasses', brand: 'Prada', category: 'sunglasses', price: 299, salePrice: null, inStock: true, stockQuantity: 8 },
      { id: 'frame-4', name: 'Gucci Aviator Collection', brand: 'Gucci', category: 'sunglasses', price: 329, salePrice: 279, inStock: true, stockQuantity: 12 },
      { id: 'frame-5', name: 'Warby Parker Square Frames', brand: 'Warby Parker', category: 'eyeglasses', price: 159, salePrice: null, inStock: false, stockQuantity: 0 },
      { id: 'frame-6', name: 'Tom Ford Premium Frames', brand: 'Tom Ford', category: 'eyeglasses', price: 399, salePrice: null, inStock: true, stockQuantity: 6 },
      { id: 'contact-1', name: 'Acuvue Oasys Daily Contacts', brand: 'Acuvue', category: 'contact-lenses', price: 79, salePrice: null, inStock: true, stockQuantity: 50 },
      { id: 'accessory-1', name: 'Premium Glasses Case', brand: 'I_Optika', category: 'accessories', price: 29, salePrice: null, inStock: true, stockQuantity: 35 },
    ];
    
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  // Handle filtering and sorting
  useEffect(() => {
    let result = [...products];
    
    // Apply search filter
    if (search) {
      result = result.filter(
        product => 
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.brand.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(product => product.category === categoryFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = (a.salePrice || a.price) - (b.salePrice || b.price);
          break;
        case 'stock':
          comparison = a.stockQuantity - b.stockQuantity;
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }
      
      return isAscending ? comparison : -comparison;
    });
    
    setFilteredProducts(result);
  }, [products, search, categoryFilter, sortBy, isAscending]);

  const handleDelete = (id: string) => {
    // In a real app, you would call your API to delete the product
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <Link href="/admin/products/add" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
          Add New Product
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm text-gray-600 mb-1">Search</label>
            <input
              type="text"
              id="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm text-gray-600 mb-1">Category</label>
            <select
              id="category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="all">All Categories</option>
              <option value="eyeglasses">Eyeglasses</option>
              <option value="sunglasses">Sunglasses</option>
              <option value="contact-lenses">Contact Lenses</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="sortBy" className="block text-sm text-gray-600 mb-1">Sort By</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="stock">Stock</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="order" className="block text-sm text-gray-600 mb-1">Order</label>
            <select
              id="order"
              value={isAscending ? 'asc' : 'desc'}
              onChange={(e) => setIsAscending(e.target.value === 'asc')}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded flex-shrink-0"></div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.brand}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1).replace('-', ' ')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.salePrice ? (
                    <div>
                      <span className="text-sm line-through text-gray-500">${product.price}</span>
                      <span className="text-sm font-medium text-gray-900 ml-2">${product.salePrice}</span>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-900">${product.price}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${product.stockQuantity < 10 ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                    {product.stockQuantity}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/admin/products/edit/${product.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}