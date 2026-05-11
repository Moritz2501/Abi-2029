import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard', '/admin', '/cash'];
const adminRoutes = ['/admin', '/cash'];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  // Protected routes check
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Admin routes check
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!token || (token.role !== 'ADMIN' && token.role !== 'ROOT')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/cash/:path*',
  ],
};
