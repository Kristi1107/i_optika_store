// src/app/api/auth/logout/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({ message: 'Logged out successfully' });
    
    // Clear the token cookie
    response.cookies.set({
      name: 'token',
      value: '',
      httpOnly: true,
      path: '/',
      expires: new Date(0),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ 
      message: 'An error occurred during logout' 
    }, { status: 500 });
  }
}