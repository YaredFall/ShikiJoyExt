import got, { OptionsOfUnknownResponseBody } from "got";

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
        console.log(reqOptions);
        const data = await got(url, reqOptions).json<ResponseType>();
        return data;
    } catch (err) {
        console.log('failed to fetch ' + url)
        throw err
    }
}