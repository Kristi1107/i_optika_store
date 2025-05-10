// src/app/api/orders/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// Get all orders for a user
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    
    // Get user ID from token
    const userId = (decoded as any).id;
    
    const db = await connectToDatabase();
    const orders = await db.collection('orders')
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// Create a new order
export async function POST(req: NextRequest) {
    try {
      const { items, shipping, payment, total, sendEmail } = await req.json();
      
      if (!items || !shipping || !payment || !total) {
        return NextResponse.json(
          { message: 'Missing required fields' },
          { status: 400 }
        );
      }
      
      const token = req.cookies.get('token')?.value;
      const userId = token ? (verifyToken(token) as any)?.id : null;
      
      const db = await connectToDatabase();
      
      // Create order with proper total
      const order = {
        userId,
        items,
        shipping,
        payment: {
          type: payment.type || 'cash_on_delivery',
          status: 'pending',
        },
        total,
        status: 'pending',
        createdAt: new Date(),
      };
      
      const result = await db.collection('orders').insertOne(order);
      
      // Update stock for ordered items
      for (const item of items) {
        await db.collection('products').updateOne(
          { id: item.id },
          { $inc: { stockQuantity: -item.quantity } }
        );
        
        // Update inStock status if needed
        await db.collection('products').updateOne(
          { id: item.id, stockQuantity: { $lte: 0 } },
          { $set: { inStock: false } }
        );
      }
      
      // Send order confirmation email
      if (sendEmail && shipping.email) {
        try {
          await sendOrderConfirmationEmail({
            to: shipping.email,
            subject: 'Order Confirmation - i Optika',
            orderData: {
              orderId: result.insertedId.toString(),
              customerName: `${shipping.firstName} ${shipping.lastName}`,
              items,
              shipping,
              total,
              orderDate: new Date().toLocaleDateString(),
            }
          });
        } catch (emailError) {
          console.error('Error sending confirmation email:', emailError);
          // We don't want to fail the order if email fails
        }
      }
      
      return NextResponse.json({ 
        message: 'Order created', 
        orderId: result.insertedId 
      });
    } catch (error) {
      console.error('Error creating order:', error);
      return NextResponse.json(
        { message: 'Failed to create order' },
        { status: 500 }
      );
    }
  }