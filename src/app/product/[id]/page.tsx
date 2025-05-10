// src/app/product/[id]/page.tsx
"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  salePrice: number | null;
  category: string;
  frameType: string;
  gender: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  colors: { name: string; code: string }[];
  sizes: { size: string; description: string; dimensions: string }[];
  images: string[];
  reviews: {
    id: string;
    user: string;
    rating: number;
    date: string;
    title: string;
    comment: string;
  }[];
};

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  
  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      
      try {
        const response = await fetch(`/api/products/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Product not found');
          } else {
            throw new Error('Failed to fetch product');
          }
          return;
        }
        
        const data = await response.json();
        setProduct(data);
        
        // Set initial selected options
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
        
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (err) {
        setError('Error loading product. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  // Handle adding to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.images[0],
      quantity,
      color: selectedColor?.name,
      size: selectedSize?.size
    });
    
    // Show success message
    setAddedToCart(true);
    
    // Reset success message after 3 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{error || 'Product Not Found'}</h1>
          <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/products" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex mb-8 text-sm">
          <Link href="/" className="text-black hover:text-indigo-600">Home</Link>
          <span className="mx-2 text-black">/</span>
          <Link href="/products" className="text-black hover:text-indigo-600">Products</Link>
          <span className="mx-2 text-black">/</span>
          <Link 
            href={`/products?category=${product.category}`} 
            className="text-black hover:text-indigo-600"
          >
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </Link>
          <span className="mx-2 text-black">/</span>
          <span className="text-black font-medium">{product.name}</span>
        </nav>
        
        {/* Success message */}
        {addedToCart && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md z-50">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p>Product added to cart!</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              {/* Replace this div with a real image when you have one */}
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-lg">[Main Product Image {mainImage + 1}]</span>
              </div>
              
              {product.salePrice && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                  Sale
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setMainImage(index)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${index === mainImage ? 'border-indigo-600' : 'border-transparent'}`}
                >
                  {/* Replace with actual thumbnail */}
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400 text-xs">[Thumb {index + 1}]</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">{product.name}</h1>
            <p className="text-lg text-black mb-4">{product.brand}</p>
            
            {/* Rating */}
            <div className="flex items-center mb-6">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill={i < Math.floor(product.rating) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                  </svg>
                ))}
              </div>
              <span className="text-black">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
            
            {/* Price */}
            <div className="mb-6">
              {product.salePrice ? (
                <div className="flex items-center space-x-4">
                  <span className="text-black line-through text-xl">${product.price}</span>
                  <span className="text-indigo-600 font-bold text-2xl">${product.salePrice}</span>
                  <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
                    Save ${product.price - product.salePrice}
                  </span>
                </div>
              ) : (
                <span className="text-indigo-600 font-bold text-2xl">${product.price}</span>
              )}
            </div>
            
            {/* Description */}
            <p className="text-black mb-6">
              {product.description}
            </p>
            
            {/* Colors */}
            <div className="mb-6">
              <h3 className="text-black font-medium mb-2">Color: {selectedColor?.name}</h3>
              <div className="flex space-x-3">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full ${selectedColor?.name === color.name ? 'ring-2 ring-offset-2 ring-indigo-600' : ''}`}
                    style={{ backgroundColor: color.code }}
                    title={color.name}
                  ></button>
                ))}
              </div>
            </div>
            
            {/* Sizes */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-black font-medium">Size: {selectedSize?.size}</h3>
                <button className="text-indigo-600 text-sm hover:underline">Size Guide</button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 border ${
                      selectedSize?.size === size.size 
                        ? 'bg-indigo-600 text-white border-indigo-600' 
                        : 'bg-white text-black border-gray-300 hover:border-indigo-600'
                    } rounded-md text-sm`}
                    title={size.dimensions}
                  >
                    {size.size} ({size.description})
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-black font-medium mb-2">Quantity</h3>
              <div className="flex">
                <button 
                  onClick={decreaseQuantity}
                  className="border border-gray-300 px-4 py-2 rounded-l-md bg-gray-50 hover:bg-gray-100"
                >
                  -
                </button>
                <input 
                  type="number" 
                  min="1" 
                  max="10"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-16 border-y border-gray-300 text-center text-black"
                />
                <button 
                  onClick={increaseQuantity}
                  className="border border-gray-300 px-4 py-2 rounded-r-md bg-gray-50 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Add to Cart */}
            <div className="flex space-x-4 mb-8">
              <button 
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 ${
                  product.inStock 
                    ? 'bg-indigo-600 hover:bg-indigo-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                } text-white px-6 py-3 rounded-lg font-medium transition`}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>
            </div>
            
            {/* Features */}
            <div className="mb-6">
              <h3 className="text-black font-medium mb-2">Features</h3>
              <ul className="list-disc list-inside space-y-1">
                {product.features.map((feature, index) => (
                  <li key={index} className="text-black">{feature}</li>
                ))}
              </ul>
            </div>
            
            {/* Shipping Info */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                <span className="text-black">Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                </svg>
                <span className="text-black">30-day easy returns</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="mt-16 border-t border-gray-200 pt-16">
          <h2 className="text-2xl font-bold text-black mb-8">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {product.reviews.map((review) => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-lg text-black mb-1">{review.title}</h3>
                    <div className="flex text-yellow-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4" fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <span className="text-black text-sm">{review.date}</span>
                </div>
                <p className="text-black mb-4">{review.comment}</p>
                <div className="flex items-center justify-between">
                  <span className="text-black font-medium">{review.user}</span>
                  <div className="flex space-x-2">
                    <button className="text-sm text-indigo-600 hover:underline">Helpful</button>
                    <button className="text-sm text-indigo-600 hover:underline">Report</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <button className="border border-indigo-600 text-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-50 transition">
              View All Reviews
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}