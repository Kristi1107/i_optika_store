// src/app/api/orders/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { sendOrderConfirmationEmail } from '@/lib/email'; // Add this import

// Define the Order type
interface Order {
  _id: any; // MongoDB ObjectId
  status: string;
  total: number;
  createdAt: Date;
  updatedAt?: Date;
  shipping: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string;
    country: string;
    notes?: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    color?: string;
    size?: string;
  }>;
  payment: {
    type: string;
    status: string;
  };
  userId?: string;
}

export async function GET(req: NextRequest) {
  try {
    // Get token from cookies
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify token and check if user is admin
    const decoded = verifyToken(token);
    if (!decoded || (decoded as any).role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    
    // Connect to database
    const db = await connectToDatabase();
    
    // Get query parameters
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter: any = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    // Get total count
    const total = await db.collection('orders').countDocuments(filter);
    
    // Get orders
    const orders = await db.collection('orders')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Format dates to prevent serialization issues
    const formattedOrders = orders.map((order: Order) => ({
      ...order,
      _id: order._id.toString(),
      createdAt: order.createdAt ? order.createdAt.toISOString() : null,
      updatedAt: order.updatedAt ? order.updatedAt.toISOString() : null,
    }));
    
    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json(
      { message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}