// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the path is for the admin panel
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('token')?.value;

    // If there's no token and we're not already on the admin login page
    if (!token && request.nextUrl.pathname !== '/admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    // For security checks, we'll rely on the client-side component to validate
    // This avoids using crypto in Edge Runtime
    if (token) {
      // Pass the request through with a custom header
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-admin-auth-check', 'true');
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        }
      });
    }
  }

  // If none of the conditions are met, proceed normally
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};