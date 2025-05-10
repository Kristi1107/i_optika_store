// src/app/products/page.tsx
"use client"

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// Define the Product type
type Product = {
  _id: string;
  id?: string;
  name: string;
  brand: string;
  price: number;
  salePrice: number | null;
  category: string;
  frameType?: string;
  gender?: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  description?: string;
  features?: string[];
  colors?: { name: string; code: string }[];
  sizes?: { size: string; description: string; dimensions?: string }[];
  images: string[];
};

// Define Gender options
const genders = ['All', 'men', 'women', 'unisex'];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get query params from URL
  const categoryParam = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || '';
  
  // State for filters
  const [filters, setFilters] = useState({
    category: categoryParam,
    brand: 'All Brands',
    frameType: 'All Types',
    gender: 'All',
    priceRange: [0, 500],
    inStockOnly: false
  });
  
  // State for products and UI
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState(sortParam || 'featured');
  const [brands, setBrands] = useState(['All Brands']);
  const [frameTypes, setFrameTypes] = useState(['All Types']);
  const [loading, setLoading] = useState(true);
  
  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Build the query string
        const queryParams = new URLSearchParams();
        if (filters.category) queryParams.set('category', filters.category);
        if (searchQuery) queryParams.set('search', searchQuery);
        if (filters.brand !== 'All Brands') queryParams.set('brand', filters.brand);
        if (filters.frameType !== 'All Types') queryParams.set('frameType', filters.frameType);
        if (filters.gender !== 'All') queryParams.set('gender', filters.gender);
        queryParams.set('minPrice', filters.priceRange[0].toString());
        queryParams.set('maxPrice', filters.priceRange[1].toString());
        if (filters.inStockOnly) queryParams.set('inStock', 'true');
        queryParams.set('sort', sortBy);
        
        // Fetch products
        const response = await fetch(`/api/products?${queryParams.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [filters, sortBy, searchQuery]);
  
  // Fetch brands and frame types for filters (run once)
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch('/api/product-options');
        if (!response.ok) throw new Error('Failed to fetch options');
        
        const data = await response.json();
        setBrands(['All Brands', ...data.brands]);
        setFrameTypes(['All Types', ...data.frameTypes]);
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };
    
    fetchFilterOptions();
  }, []);
  
  // Update URL when category changes
  const updateCategory = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', category);
    router.push(`/products?${params.toString()}`);
    setFilters({...filters, category});
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex mb-8 text-sm">
          <Link href="/" className="text-black hover:text-indigo-600">Home</Link>
          <span className="mx-2 text-black">/</span>
          <span className="text-black font-medium">
            {filters.category ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1) : 'All Products'}
          </span>
        </nav>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-black">Filters</h2>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2 text-black">Category</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => updateCategory('')}
                    className={`block ${filters.category === '' ? 'text-indigo-600 font-medium' : 'text-black'}`}
                  >
                    All Products
                  </button>
                  <button 
                    onClick={() => updateCategory('eyeglasses')}
                    className={`block ${filters.category === 'eyeglasses' ? 'text-indigo-600 font-medium' : 'text-black'}`}
                  >
                    Eyeglasses
                  </button>
                  <button 
                    onClick={() => updateCategory('sunglasses')}
                    className={`block ${filters.category === 'sunglasses' ? 'text-indigo-600 font-medium' : 'text-black'}`}
                  >
                    Sunglasses
                  </button>
                  <button 
                    onClick={() => updateCategory('contact-lenses')}
                    className={`block ${filters.category === 'contact-lenses' ? 'text-indigo-600 font-medium' : 'text-black'}`}
                  >
                    Contact Lenses
                  </button>
                  <button 
                    onClick={() => updateCategory('accessories')}
                    className={`block ${filters.category === 'accessories' ? 'text-indigo-600 font-medium' : 'text-black'}`}
                  >
                    Accessories
                  </button>
                </div>
              </div>
              
              {/* Brand Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2 text-black">Brand</h3>
                <select 
                  value={filters.brand}
                  onChange={(e) => setFilters({...filters, brand: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                >
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              
              {/* Frame Type Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2 text-black">Frame Type</h3>
                <select 
                  value={filters.frameType}
                  onChange={(e) => setFilters({...filters, frameType: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                >
                  {frameTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              {/* Gender Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2 text-black">Gender</h3>
                <div className="flex space-x-4">
                  {genders.map(gender => (
                    <button
                      key={gender}
                      onClick={() => setFilters({...filters, gender})}
                      className={`px-3 py-1 rounded-full border ${
                        filters.gender === gender
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-black border-gray-300'
                      }`}
                    >
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2 text-black">Price Range</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-black">${filters.priceRange[0]}</span>
                  <span className="text-black">${filters.priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters({...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value)]})}
                  className="w-full"
                />
              </div>
              
              {/* In Stock Filter */}
              <div className="mb-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={filters.inStockOnly}
                    onChange={() => setFilters({...filters, inStockOnly: !filters.inStockOnly})}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-black">In Stock Only</span>
                </label>
              </div>
              
              {/* Reset Filters */}
              <button
                onClick={() => setFilters({
                  category: categoryParam,
                  brand: 'All Brands',
                  frameType: 'All Types',
                  gender: 'All',
                  priceRange: [0, 500],
                  inStockOnly: false
                })}
                className="w-full py-2 bg-gray-200 text-black rounded hover:bg-gray-300 transition"
              >
                Reset Filters
              </button>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Sort and Results Count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
              <div className="mb-4 sm:mb-0">
                <p className="text-black">{products.length} products found</p>
              </div>
              <div className="w-full sm:w-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto p-2 border border-gray-300 rounded text-black"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>
            
            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <h3 className="text-xl font-semibold mb-2 text-black">No products found</h3>
                <p className="text-black">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product._id || product.id} className="bg-white rounded-lg shadow-sm overflow-hidden group">
                    <Link href={`/product/${product._id || product.id}`}>
                      <div className="aspect-square bg-gray-200 relative">
                        {/* Product image */}
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">[Product Image]</span>
                          </div>
                        )}
                        
                        {product.salePrice && (
                          <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                            Sale
                          </div>
                        )}
                        
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
                            <span className="text-black font-medium">Out of Stock</span>
                          </div>
                        )}
                      </div>
                    </Link>
                    
                    <div className="p-4">
                      <Link href={`/product/${product._id || product.id}`}>
                        <h3 className="font-medium text-lg mb-1 text-black hover:text-indigo-600 transition">
                          {product.name}
                        </h3>
                      </Link>
                      
                      <p className="text-black text-sm mb-2">{product.brand}</p>
                      
                      <div className="flex items-center mb-2">
                        {/* Star Rating */}
                        <div className="flex text-yellow-400 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-4 h-4" fill={i < Math.floor(product.rating) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                            </svg>
                          ))}
                        </div>
                        <span className="text-black text-sm">
                          ({product.reviewCount})
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          {product.salePrice ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-black line-through">${product.price}</span>
                              <span className="text-indigo-600 font-semibold">${product.salePrice}</span>
                            </div>
                          ) : (
                            <span className="text-indigo-600 font-semibold">${product.price}</span>
                          )}
                        </div>
                        
                        {product.colors && (
                          <div className="flex space-x-1">
                            {product.colors.slice(0, 3).map((color, i) => {
                              // Define the color map with index signature
                              const colorMap: { [key: string]: string } = {
                                'Black': 'bg-gray-900',
                                'Silver': 'bg-gray-400',
                                'Gold': 'bg-yellow-500',
                                'Rose Gold': 'bg-pink-300',
                                'Blue': 'bg-blue-600',
                                'Tortoise': 'bg-amber-700'
                              };
                              
                              return (
                                <div 
                                  key={i} 
                                  className={`w-4 h-4 rounded-full ${colorMap[color.name] || 'bg-gray-500'} ${i === 0 ? 'ring-1 ring-gray-300' : ''}`}
                                />
                              );
                            })}
                          </div>
                        )}
                      </div>
                      
                      {product.inStock && (
                        <button 
                          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}