// src/lib/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import bcrypt from 'bcryptjs';

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Create token
export function createToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Verify token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

// Check if user is admin - This function should NOT be used in middleware
export async function verifyAdmin(token: string): Promise<boolean> {
  try {
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return false;
    }
    
    const db = await connectToDatabase();
    const user = await db.collection('users').findOne({ _id: decoded.id });
    
    return user?.role === 'admin';
  } catch (error) {
    return false;
  }
}

// Node.js-only middleware for API routes - not for Edge middleware!
export function withAuth(handler: Function) {
  return async (req: NextRequest, context?: any) => {
    try {
      const token = req.cookies.get('token')?.value;
      
      if (!token) {
        return NextResponse.json(
          { message: 'Unauthorized' },
          { status: 401 }
        );
      }
      
      const decoded = verifyToken(token);
      
      if (!decoded) {
        return NextResponse.json(
          { message: 'Invalid token' },
          { status: 401 }
        );
      }
      
      // Add user to request
      (req as any).user = decoded;
      
      return handler(req, context);
    } catch (error) {
      return NextResponse.json(
        { message: 'Authentication error' },
        { status: 500 }
      );
    }
  };
}

// Node.js-only middleware for admin API routes - not for Edge middleware!
export function withAdminAuth(handler: Function) {
  return async (req: NextRequest, context?: any) => {
    try {
      const token = req.cookies.get('token')?.value;
      
      if (!token) {
        return NextResponse.json(
          { message: 'Unauthorized' },
          { status: 401 }
        );
      }
      
      const decoded = verifyToken(token);
      
      if (!decoded) {
        return NextResponse.json(
          { message: 'Invalid token' },
          { status: 401 }
        );
      }
      
      if ((decoded as any).role !== 'admin') {
        return NextResponse.json(
          { message: 'Forbidden' },
          { status: 403 }
        );
      }
      
      // Add user to request
      (req as any).user = decoded;
      
      return handler(req, context);
    } catch (error) {
      return NextResponse.json(
        { message: 'Authentication error' },
        { status: 500 }
      );
    }
  };
}