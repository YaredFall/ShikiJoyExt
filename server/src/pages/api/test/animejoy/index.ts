import got from '@yaredfall/cloudflare-scraper';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await got('https://animejoy.ru/').text()
    res.status(200).send(response)
  } catch (err: any) {
    // res.status(500).send(`<h1>${err}</h1>`)
    res.status(500).json(err.response)
  }
}
