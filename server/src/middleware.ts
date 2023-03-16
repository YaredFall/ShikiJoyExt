import { NextResponse, NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {

    const response = NextResponse.next();
    const origin = request.headers.get('Origin');
    if (origin === 'https://animejoy.ru' || process.env.NODE_ENV === "development")
        response.headers.set('Access-Control-Allow-Origin', origin!)

    return response
}

export const config = {
    matcher: '/api/:path*'
}