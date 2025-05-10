// src/app/api/auth/login/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/auth';
import { createToken } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    
    if (!username || !password) {
      return NextResponse.json({ 
        message: 'Username and password are required' 
      }, { status: 400 });
    }
    
    const db = await connectToDatabase();
    const user = await db.collection('users').findOne({ username });
    
    if (!user) {
      return NextResponse.json({ 
        message: 'Invalid credentials' 
      }, { status: 401 });
    }
    
    const isValid = await verifyPassword(password, user.password);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid credentials' 
      }, { status: 401 });
    }
    
    // Create a token
    const token = createToken({
      id: user._id.toString(),
      username: user.username,
      role: user.role,
    });
    
    // Set the token as a cookie
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id.toString(),
        username: user.username,
        role: user.role,
      }
    });
    
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      message: 'An error occurred during login' 
    }, { status: 500 });
  }
}