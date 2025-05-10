// src/app/api/admin/products/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// Define Product interface
interface Product {
  _id: any; // MongoDB ObjectId
  name: string;
  brand: string;
  price: number;
  category: string;
  stockQuantity: number;
  inStock: boolean;
  [key: string]: any; // Allow for any additional properties
}

// Get all products (admin)
export async function GET(req: NextRequest) {
  try {
    // Check admin auth
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const decoded = verifyToken(token);
    if (!decoded || (decoded as any).role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    
    const db = await connectToDatabase();
    const products = await db.collection('products').find({}).toArray();
    
    // Format MongoDB ObjectIDs to strings for JSON serialization
    const formattedProducts = products.map((product: Product) => ({
      ...product,
      _id: product._id.toString()
    }));
    
    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// Create new product
export async function POST(req: NextRequest) {
  try {
    // Check admin auth
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const decoded = verifyToken(token);
    if (!decoded || (decoded as any).role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    
    // Get request body
    const productData = await req.json();
    
    // Validate required fields
    if (!productData.name || !productData.price || !productData.category) {
      return NextResponse.json(
        { message: 'Name, price, and category are required' },
        { status: 400 }
      );
    }
    
    // Add creation timestamp
    productData.createdAt = new Date();
    
    const db = await connectToDatabase();
    const result = await db.collection('products').insertOne(productData);
    
    return NextResponse.json({
      _id: result.insertedId.toString(),
      ...productData
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { message: 'Failed to create product' },
      { status: 500 }
    );
  }
}