// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export function middleware(request: NextRequest) {
  // Check if the path is for the admin panel
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('token')?.value;

    // If there's no token and we're not already on the admin login page
    if (!token && request.nextUrl.pathname !== '/admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    // If there is a token, verify it
    if (token) {
      const decoded = verifyToken(token);
      
      // If token is invalid or not for an admin
      if (!decoded || (decoded as any).role !== 'admin') {
        // Clear the invalid token
        const response = NextResponse.redirect(new URL('/admin', request.url));
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
      }
    }
  }

  // If none of the conditions are met, proceed normally
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};