// import got from '@yaredfall/cloudflare-scraper';
import { got, Method } from 'got';
import type { NextApiResponse, NextApiRequest } from 'next';
import { cacheData, getCachedData } from '@/utils/caching';

async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { page, ...query } = req.query;

    const url = (Array.isArray(page) ? page!.join('/') : page!);

    try {
        const matches = req.body
                        ? Array.from(JSON.stringify(req.body).matchAll(
                /------WebKitFormBoundary[\s\S]*?name=.*?"(?<name>.*?)\\"\\r\\n\\r\\n(?<value>.*?)\\r\\n/mg))
                        : [];
        const formFields = Object.fromEntries(matches.map(m => {
            return [m.groups?.name, m.groups?.value];
        }));

        const endSlash = !url.match(/(?:\/|\.[a-z]{1,4})$/);

        let data = getCachedData(req.url + JSON.stringify(formFields));

        if (!data) {
            const params = Object.entries(query).length ? "?" + Object.entries(query).map(e => e[0] + "=" + e[1]).join('&') : "";
            
            const response = got(`https://api.scraperapi.com/?api_key=${process.env.SCRAPERAPI_KEY}&url=https://animejoy.ru/${
                    encodeURIComponent(url + (endSlash ? "/" : "") + params)}`,
                {
                    method: req.method as Method,
                    form: req.method === 'POST' ? formFields : undefined
                }
            );

            if (url.endsWith(".jpg")) {
                data = await response.buffer();
            } else {
                data = await response.text();
            }
            cacheData(req.url + JSON.stringify(formFields), data);
        }
        
        res.status(200).send(data);
    } catch (err: any) {
        if (err.response?.statusCode === 403) {
            console.log("Error caused by Cloudflare security check");
            res.status(403).send("<h1>Cloudflare security check. Try again</h1>");
        } else {
            console.log(err);
            res.status(500).send(`<h1>${err}</h1>`);
        }
    }
}

export default handler;