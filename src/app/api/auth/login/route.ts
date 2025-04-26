// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createToken, verifyPassword } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    
    // In production, fetch user from database
    const db = await connectToDatabase();
    const collection = db.collection('users');
    const user = await collection.findOne({ username });
    
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    const isValid = await verifyPassword(password, user.password);
    
    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Create token and set cookie
    const token = createToken({
      id: user._id.toString(),
      username: user.username,
      role: user.role
    });
    
    const response = NextResponse.json({ 
      success: true, 
      user: { 
        id: user._id.toString(), 
        username: user.username, 
        role: user.role 
      } 
    });
    
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: 'strict',
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}