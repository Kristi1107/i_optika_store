// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const db = await connectToDatabase();
    const products = await db.collection('products').find({}).toArray();
    
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication in middleware
    // This would be handled by Route Handlers in Next.js 13+
    
    const data = await req.json();
    const db = await connectToDatabase();
    
    const result = await db.collection('products').insertOne(data);
    
    return NextResponse.json({ 
      message: 'Product created', 
      productId: result.insertedId 
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to create product' },
      { status: 500 }
    );
  }
}