// src/app/api/admin/orders/[id]/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

// Get a single order by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const decoded = verifyToken(token);
    if (!decoded || (decoded as any).role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    
    const db = await connectToDatabase();
    
    // Validate ID format
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: 'Invalid order ID' }, { status: 400 });
    }
    
    const order = await db.collection('orders').findOne({ _id: new ObjectId(params.id) });
    
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    
    // Format dates to prevent serialization issues
    const formattedOrder = {
      ...order,
      _id: order._id.toString(),
      createdAt: order.createdAt ? order.createdAt.toISOString() : null,
      updatedAt: order.updatedAt ? order.updatedAt.toISOString() : null,
    };
    
    return NextResponse.json(formattedOrder);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { message: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// Update order status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const decoded = verifyToken(token);
    if (!decoded || (decoded as any).role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    
    const { status } = await req.json();
    
    if (!status) {
      return NextResponse.json(
        { message: 'Status is required' },
        { status: 400 }
      );
    }
    
    // Validate status value
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    const db = await connectToDatabase();
    
    // Validate ID format
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: 'Invalid order ID' }, { status: 400 });
    }
    
    // Update order
    const updatedOrder = await db.collection('orders').findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { 
        $set: { 
          status, 
          updatedAt: new Date() 
        } 
      },
      { returnDocument: 'after' }
    );
    
    if (!updatedOrder) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    
    // Format dates to prevent serialization issues
    const formattedOrder = {
      ...updatedOrder,
      _id: updatedOrder._id.toString(),
      createdAt: updatedOrder.createdAt ? updatedOrder.createdAt.toISOString() : null,
      updatedAt: updatedOrder.updatedAt ? updatedOrder.updatedAt.toISOString() : null,
    };
    
    return NextResponse.json(formattedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { message: 'Failed to update order' },
      { status: 500 }
    );
  }
}