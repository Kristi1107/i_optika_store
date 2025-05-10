// src/app/api/checkout/payment-intent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent } from '@/lib/stripe';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();
    
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { message: 'Invalid amount' },
        { status: 400 }
      );
    }
    
    const paymentIntent = await createPaymentIntent(amount);
    
    return NextResponse.json(paymentIntent);
  } catch (error) {
    console.error('Payment intent error:', error);
    return NextResponse.json(
      { message: 'Error creating payment intent' },
      { status: 500 }
    );
  }
}