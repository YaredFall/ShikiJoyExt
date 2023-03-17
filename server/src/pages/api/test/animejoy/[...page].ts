import got, { Method } from 'got';
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from "formidable";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { page, ...query } = req.query;

    const url = (Array.isArray(page) ? page!.join('/') : page!);
    const form = new formidable.IncomingForm();

    try {
        const formFields = await new Promise<Object>(function (resolve, reject) {
            form.parse(req, function (err, fields, files) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(fields);
            });
        });
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

export const config = {
    api: {
        bodyParser: false
    }
};