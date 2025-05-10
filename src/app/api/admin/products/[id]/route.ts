// src/app/api/admin/products/[id]/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

// Get a product by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Validate ID format
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: 'Invalid product ID' }, { status: 400 });
    }
    
    const db = await connectToDatabase();
    const product = await db.collection('products').findOne({ 
      _id: new ObjectId(params.id) 
    });
    
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    
    // Format MongoDB ObjectID to string for JSON serialization
    return NextResponse.json({
      ...product,
      _id: product._id.toString()
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { message: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// Update a product
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Validate ID format
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: 'Invalid product ID' }, { status: 400 });
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
    
    // Add update timestamp
    productData.updatedAt = new Date();
    
    // Remove _id from update data if present
    if (productData._id) {
      delete productData._id;
    }
    
    const db = await connectToDatabase();
    const result = await db.collection('products').findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: productData },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    
    // Format MongoDB ObjectID to string for JSON serialization
    return NextResponse.json({
      ...result,
      _id: result._id.toString()
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { message: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// Delete a product
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Validate ID format
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: 'Invalid product ID' }, { status: 400 });
    }
    
    const db = await connectToDatabase();
    const result = await db.collection('products').deleteOne({ 
      _id: new ObjectId(params.id) 
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { message: 'Failed to delete product' },
      { status: 500 }
    );
  }
}