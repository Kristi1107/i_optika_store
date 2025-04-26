"use client"

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// Mock product data (would normally come from an API/database)
const mockProducts = [
  {
    id: 'frame-1',
    name: 'Ray-Ban Classic Wayfarers',
    brand: 'Ray-Ban',
    price: 199,
    salePrice: null,
    category: 'sunglasses',
    frameType: 'full-rim',
    gender: 'unisex',
    inStock: true,
    rating: 4.8,
    reviewCount: 124,
    imageUrl: '/placeholder-product-1.jpg',
    colors: ['Black', 'Tortoise', 'Blue']
  },
  {
    id: 'frame-2',
    name: 'Oakley Rectangle Frames',
    brand: 'Oakley',
    price: 249,
    salePrice: 199,
    category: 'eyeglasses',
    frameType: 'half-rim',
    gender: 'men',
    inStock: true,
    rating: 4.5,
    reviewCount: 96,
    imageUrl: '/placeholder-product-2.jpg',
    colors: ['Black', 'Silver', 'Blue']
  },
  {
    id: 'frame-3',
    name: 'Prada Designer Sunglasses',
    brand: 'Prada',
    price: 299,
    salePrice: null,
    category: 'sunglasses',
    frameType: 'full-rim',
    gender: 'women',
    inStock: true,
    rating: 4.9,
    reviewCount: 87,
    imageUrl: '/placeholder-product-3.jpg',
    colors: ['Black', 'Gold', 'Rose Gold']
  },
  {
    id: 'frame-4',
    name: 'Gucci Aviator Collection',
    brand: 'Gucci',
    price: 329,
    salePrice: 279,
    category: 'sunglasses',
    frameType: 'full-rim',
    gender: 'unisex',
    inStock: true,
    rating: 4.7,
    reviewCount: 53,
    imageUrl: '/placeholder-product-4.jpg',
    colors: ['Silver', 'Gold', 'Black']
  },
  {
    id: 'frame-5',
    name: 'Warby Parker Square Frames',
    brand: 'Warby Parker',
    price: 159,
    salePrice: null,
    category: 'eyeglasses',
    frameType: 'full-rim',
    gender: 'unisex',
    inStock: false,
    rating: 4.6,
    reviewCount: 42,
    imageUrl: '/placeholder-product-5.jpg',
    colors: ['Tortoise', 'Black', 'Blue']
  },
  {
    id: 'frame-6',
    name: 'Tom Ford Premium Frames',
    brand: 'Tom Ford',
    price: 399,
    salePrice: null,
    category: 'eyeglasses',
    frameType: 'rimless',
    gender: 'men',
    inStock: true,
    rating: 4.9,
    reviewCount: 31,
    imageUrl: '/placeholder-product-6.jpg',
    colors: ['Black', 'Gold', 'Silver']
  },
  {
    id: 'contact-1',
    name: 'Acuvue Oasys Daily Contacts',
    brand: 'Acuvue',
    price: 79,
    salePrice: null,
    category: 'contact-lenses',
    inStock: true,
    rating: 4.8,
    reviewCount: 212,
    imageUrl: '/placeholder-contacts.jpg',
  },
  {
    id: 'accessory-1',
    name: 'Premium Glasses Case',
    brand: 'I_Optika',
    price: 29,
    salePrice: null,
    category: 'accessories',
    inStock: true,
    rating: 4.7,
    reviewCount: 64,
    imageUrl: '/placeholder-accessory.jpg',
  }
];

// Filter options
const brands = ['All Brands', 'Ray-Ban', 'Oakley', 'Prada', 'Gucci', 'Warby Parker', 'Tom Ford', 'Acuvue'];
const frameTypes = ['All Types', 'full-rim', 'half-rim', 'rimless'];
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
  const [products, setProducts] = useState(mockProducts);
  const [sortBy, setSortBy] = useState(sortParam || 'featured');
  
  // Apply filters and sorting
  useEffect(() => {
    let filteredProducts = [...mockProducts];
    
    // Filter by category
    if (filters.category) {
      filteredProducts = filteredProducts.filter(
        product => product.category === filters.category
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      filteredProducts = filteredProducts.filter(
        product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by brand
    if (filters.brand !== 'All Brands') {
      filteredProducts = filteredProducts.filter(
        product => product.brand === filters.brand
      );
    }
    
    // Filter by frame type
    if (filters.frameType !== 'All Types') {
      filteredProducts = filteredProducts.filter(
        product => product.frameType === filters.frameType
      );
    }
    
    // Filter by gender
    if (filters.gender !== 'All') {
      filteredProducts = filteredProducts.filter(
        product => product.gender === filters.gender
      );
    }
    
    // Filter by price range
    filteredProducts = filteredProducts.filter(
      product => {
        const price = product.salePrice || product.price;
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      }
    );
    
    // Filter by stock
    if (filters.inStockOnly) {
      filteredProducts = filteredProducts.filter(product => product.inStock);
    }
    
    // Sort products
    switch (sortBy) {
      case 'price-low-high':
        filteredProducts.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-high-low':
        filteredProducts.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // In a real app, you'd sort by date
        break;
      default:
        // Featured - no change to order
        break;
    }
    
    setProducts(filteredProducts);
  }, [filters, sortBy, searchQuery]);
  
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
            
            {/* Products */}
            {products.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <h3 className="text-xl font-semibold mb-2 text-black">No products found</h3>
                <p className="text-black">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden group">
                    <Link href={`/product/${product.id}`}>
                      <div className="aspect-square bg-gray-200 relative">
                        {/* Replace with actual product image */}
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">[Product Image]</span>
                        </div>
                        
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
                      <Link href={`/product/${product.id}`}>
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
                                  className={`w-4 h-4 rounded-full ${colorMap[color] || 'bg-gray-500'} ${i === 0 ? 'ring-1 ring-gray-300' : ''}`}
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