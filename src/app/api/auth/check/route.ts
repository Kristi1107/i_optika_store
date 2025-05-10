// src/app/api/auth/check/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ 
        authenticated: false,
        message: 'No token provided'
      }, { status: 401 });
    }
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json({ 
        authenticated: false,
        message: 'Invalid token'
      }, { status: 401 });
    }
    
    return NextResponse.json({ 
      authenticated: true,
      user: decoded
    });
  } catch (error) {
    return NextResponse.json({ 
      authenticated: false,
      message: 'Authentication error'
    }, { status: 500 });
  }
}