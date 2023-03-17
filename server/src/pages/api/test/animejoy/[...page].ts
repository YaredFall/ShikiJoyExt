import got from 'got'
import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from "formidable";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    return new Promise((resolve, reject) => {
        const { page, ...query } = req.query;

        const url = (Array.isArray(page) ? page?.join('/') : page);
        try {
            const form = new formidable.IncomingForm();
            form.parse(req, async function (err, fields, files) {
                const response = await got.post(`https://animejoy.ru/${url + "/"}${
                        Object.entries(query).length ? "?" + Object.entries(query).map(e => e[0] + "=" + e[1]).join('&') : ""}`,
                    {
                        form: fields
                    }
                ).text()
                res.status(200).send(response);
                resolve(0);
            });
        } catch (err) {
            res.status(500).send(`<h1>${err}</h1>`);
            console.error(err);
            resolve(0)
        }
    })
}

export const config = {
    api: {
        bodyParser: false
    }
};