import got from 'got';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await got(`https://api.scraperapi.com/?api_key=${process.env.SCRAPERAPI_KEY}&url=https://animejoy.ru/`).text()
    res.status(200).send(response)
  } catch (err: any) {
    // res.status(500).send(`<h1>${err}</h1>`)
    res.status(500).json(err.response)
  }
}
