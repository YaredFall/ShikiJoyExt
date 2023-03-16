import got from 'got'
import type { NextApiRequest, NextApiResponse } from 'next'
import { isArray } from "util";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { page, ...query } = req.query;
    const url = (Array.isArray(page) ? page?.join('/') : page);
    try {
        const response = await got(`https://animejoy.ru/${url + "/"}${
            Object.entries(query).length ? "?" + Object.entries(query).map(e => e[0] + "=" + e[1]).join('&') : ""}`).text()
        res.status(200).send(response)
    } catch (err) {
        res.status(500).send(`<h1>${err}</h1>`)
    }
}
