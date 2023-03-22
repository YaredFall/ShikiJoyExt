import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.redirect(process.env.SHIKIMORI_REDIRECT_LINK!)
}
