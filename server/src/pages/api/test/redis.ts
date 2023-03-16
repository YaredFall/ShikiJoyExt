import { redis } from '@/lib/redis';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let data = await redis.get('/api/test/shikiRPS');

    res.status(200).json(data)
}
