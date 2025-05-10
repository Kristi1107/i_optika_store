// src/app/api/product-options/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const db = await connectToDatabase();
    
    // Get unique brands
    const brands = await db.collection('products').distinct('brand');
    
    // Get unique frame types
    const frameTypes = await db.collection('products').distinct('frameType');
    
    return NextResponse.json({
      brands,
      frameTypes
    });
  } catch (error) {
    console.error('Error fetching product options:', error);
    return NextResponse.json(
      { message: 'Failed to fetch product options' },
      { status: 500 }
    );
  }
}