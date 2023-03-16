import got from "got";

const baseURL = "https://shikimori.one/api";
const options = {
    headers: {
        "User-Agent": "ShikiJoy"
    }
}

export async function fetchShikimoriAPI(route: string) {
    let url = route;
    if (!route.startsWith(baseURL)) {
        if (!route.startsWith('/'))
            url = baseURL + '/' + route
        else
            url = baseURL + route
    }

    try {
        const data = await got(url, options).json();
        return data;
    } catch (err) {
        console.log('failed to fetch ' + url)
        throw err
    }
}