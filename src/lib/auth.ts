// src/lib/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import { sign, verify } from 'jsonwebtoken';
import { hash, compare } from 'bcryptjs';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function hashPassword(password: string) {
  return await hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword);
}

export function createToken(payload: any) {
  return sign(payload, SECRET_KEY, { expiresIn: '1d' });
}

export function verifyToken(token: string) {
  try {
    return verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
}

// Middleware for protected routes
export function withAuth(middleware: any) {
  return async (request: NextRequest) => {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
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

    // Add user to request context
    const requestWithUser = {
      ...request,
      user: decoded,
    };

    return middleware(requestWithUser);
  };
}

// Middleware specifically for admin routes
export function withAdminAuth(middleware: any) {
  return withAuth(async (request: any) => {
    if (request.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 403 }
      );
    }

    return middleware(request);
  });
}