import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchShikimoriAPI } from '@/shikimori_cfg'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const { q } = req.query;
    if (!q || Array.isArray(q)) {
        return res.status(400).send("<h1>Bad request! Enter 'q' query param with desired shikimori api route</h1>")
    }

    try {
        const response = await fetchShikimoriAPI(q)
        res.status(200).json(response)
    } catch (err) {
        res.status(400).send(`<h1>${err}</h1>`)
    }
}