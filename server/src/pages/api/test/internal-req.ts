import got from 'got'
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json(await got('http://' + req.headers.host! + '/api/test/req', { headers: {
    "User-Agent": "ShikiJoy"
  } }).json())
}
