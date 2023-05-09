import got from 'got';
import type { NextApiResponse } from 'next'
import { cacheData, NextApiRequestWithCache } from '@/utils/caching';
import withCache from "@/middleware/withCache";

async function handler(
  req: NextApiRequestWithCache,
  res: NextApiResponse
) {
  try {
    let response = req.cachedData;
    if (!response) {
      response = await got(`https://api.scraperapi.com/?api_key=${process.env.SCRAPERAPI_KEY}&url=https://animejoy.ru/`).text()
      cacheData(req.url, response)
    }
    res.status(200).send(response)
  } catch (err: any) {
    // res.status(500).send(`<h1>${err}</h1>`)
    res.status(500).json(err.response)
  }
}

export default withCache(handler)