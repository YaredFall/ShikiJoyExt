import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchShikimoriAPI } from '@/api'
import { NextApiRequestWithCache, cacheData } from '@/utils/caching';
import withCache from '@/middleware/withCache';
import { redis } from '@/lib/redis';

async function handler(
    req: NextApiRequestWithCache,
    res: NextApiResponse
) {

    if (req.cachedData) {
        res.status(200).json(req.cachedData);
    } else {
        try {
            const promises = [
                fetchShikimoriAPI("animes/1"),
                fetchShikimoriAPI("animes/5"),
                fetchShikimoriAPI("animes/6"),
                fetchShikimoriAPI("animes/7"),
                fetchShikimoriAPI("animes/8"),
                fetchShikimoriAPI("animes/16")
            ]
            const response = await Promise.all(promises);
            cacheData(req.url, response);
            res.status(200).json(response)
        } catch (err) {
            res.status(400).send(`<h1>${err}</h1>`)
        }
    }

}

export default withCache(handler);