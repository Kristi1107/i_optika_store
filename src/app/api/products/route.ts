// src/app/api/products/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    
    // Get query parameters
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');
    const brand = url.searchParams.get('brand');
    const frameType = url.searchParams.get('frameType');
    const gender = url.searchParams.get('gender');
    const minPrice = parseInt(url.searchParams.get('minPrice') || '0');
    const maxPrice = parseInt(url.searchParams.get('maxPrice') || '10000');
    const inStock = url.searchParams.get('inStock') === 'true';
    const sort = url.searchParams.get('sort') || 'featured';
    
    // Build query
    const query: any = {};
    
    if (category) query.category = category;
    if (brand && brand !== 'All Brands') query.brand = brand;
    if (frameType && frameType !== 'All Types') query.frameType = frameType;
    if (gender && gender !== 'All') query.gender = gender;
    if (inStock) query.inStock = true;
    
    // Price query
    query.price = { $gte: minPrice, $lte: maxPrice };
    
    // Search query
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Connect to database
    const db = await connectToDatabase();
    
    // Get products
    let productsCursor = db.collection('products').find(query);
    
    // Apply sorting
    switch (sort) {
      case 'price-low-high':
        productsCursor = productsCursor.sort({ price: 1 });
        break;
      case 'price-high-low':
        productsCursor = productsCursor.sort({ price: -1 });
        break;
      case 'rating':
        productsCursor = productsCursor.sort({ rating: -1 });
        break;
      case 'newest':
        productsCursor = productsCursor.sort({ createdAt: -1 });
        break;
      default:
        // Featured sorting
        productsCursor = productsCursor.sort({ featured: -1 });
        break;
    }
    
    const products = await productsCursor.toArray();
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}