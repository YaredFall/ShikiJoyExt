import { NextResponse, NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {

    const response = NextResponse.next();
    const origin = request.headers.get('Origin');
    // ! TODO: remove localhost on release
    if (origin === 'https://animejoy.ru' || origin === "http://127.0.0.1:5173")
        response.headers.set('Access-Control-Allow-Origin', origin)

    return response
}

export const config = {
    matcher: '/api/shikimori/:path*'
}