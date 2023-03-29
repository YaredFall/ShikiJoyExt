// @ts-ignore
import got from 'cloudflare-scraper';
import { Method } from 'got';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { page, ...query } = req.query;

    const url = (Array.isArray(page) ? page!.join('/') : page!);

    try {
        const matches = req.body 
                        ? Array.from(JSON.stringify(req.body).matchAll(/------WebKitFormBoundary[\s\S]*?name=.*?"(?<name>.*?)\\"\\r\\n\\r\\n(?<value>.*?)\\r\\n/mg)) 
                        : [];
        const formFields = Object.fromEntries(matches.map(m => {
            return [m.groups?.name, m.groups?.value]
        }))
        
        const response = got(`https://animejoy.ru/${url + (url.endsWith(".jpg") ? "" : "/")}${
                Object.entries(query).length ? "?" + Object.entries(query).map(e => e[0] + "=" + e[1]).join('&') : ""}`,
            {
                method: req.method as Method,
                form: req.method === 'POST' ? formFields : undefined
            }
        );
        
        if (url.endsWith(".jpg")) {
            res.setHeader("Content-Type", "image/jpeg");
            res.status(200).send(await response.buffer())
        } else {
            res.status(200).send(await response.text())
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(`<h1>${err}</h1>`);
    }
}

// export const config = {
//     api: {
//         bodyParser: false
//     }
// };