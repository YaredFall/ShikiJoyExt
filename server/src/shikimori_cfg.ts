import got, { OptionsOfUnknownResponseBody } from "got";

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
        const reqOptions = { ...options, headers: { ...defaultHeaders, ...options?.headers} };
        const data = await got(url, reqOptions).json<ResponseType>();
        return data;
    } catch (err) {
        console.log('failed to fetch ' + url)
        throw err
    }
}