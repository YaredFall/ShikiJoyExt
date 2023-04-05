import got, { OptionsOfUnknownResponseBody, RetryOptions } from "got";

export type AuthResponse = {
    access_token: string,
    token_type: "Bearer",
    expires_in: number,
    refresh_token: string,
    scope: string,
    created_at: number
}

const baseURL = "https://shikimori.one";
const baseApiURL = baseURL + "/api"
const defaultHeaders = {
    "User-Agent": "ShikiJoy"
};
const defaultRetryOption = {
    limit: 2,
    methods: ['GET', 'PUT', 'HEAD', 'DELETE', 'OPTIONS', 'TRACE'],
    statusCodes: [
        408, 413, 429, 500,
        502, 503, 504, 521,
        522, 524
    ],
    errorCodes: [
        'ECONNRESET',
        'EADDRINUSE',
        'ECONNREFUSED',
        'EPIPE',
        'ENOTFOUND',
        'ENETUNREACH',
        'EAI_AGAIN'
    ]
} as Partial<RetryOptions>

export async function fetchShikimoriAPI<ResponseType = unknown>(route: string, options?: OptionsOfUnknownResponseBody) {
    let url = route;
    if (!route.startsWith(baseURL) && !route.startsWith(baseApiURL)) {
        if (!route.startsWith('/')) {
            url = baseApiURL + '/' + route;
        } else {
            url = baseApiURL + route;
        }
    }

    try {
        const reqOptions = { timeout: { request: 2000 }, retry: defaultRetryOption, ...options, headers: { ...defaultHeaders, ...options?.headers} };
        const data = await got(url, reqOptions).json<ResponseType>();
        return data;
    } catch (err: any) {
        console.log('failed to fetch ' + url + ' with error ' + err.name)
        throw err
    }
}