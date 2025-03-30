import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // If already on the target page, allow access
  if (pathname === '/Enter-url') {
    return NextResponse.next();
  }

  // Check for the visited cookie
  const visited = request.cookies.get('visited');

  if (!visited) {
    const response = NextResponse.redirect(
      new URL('/Enter-url?username=null', request.url)
    );

    // Set the visited cookie to prevent repeated redirects
    response.cookies.set('visited', 'true', {
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  }

  return NextResponse.next();
}

// Apply middleware to all pages
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
