// src/app/api/auth/check/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ 
        authenticated: false 
      });
    }
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json({ 
        authenticated: false 
      });
    }
    
    return NextResponse.json({
      authenticated: true,
      user: {
        id: (decoded as any).id,
        username: (decoded as any).username,
        role: (decoded as any).role
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      authenticated: false 
    });
  }
}