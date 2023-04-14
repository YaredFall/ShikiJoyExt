import type { NextApiRequest, NextApiResponse } from 'next'
import withCache from "@/middleware/withCache";
import { cacheData, NextApiRequestWithCache } from "@/utils/caching";
import { fetchShikimoriAPI } from "@/shikimori_cfg";

async function handler(req: NextApiRequestWithCache, res: NextApiResponse) {
    const { id } = req.query;
    if (!id || Array.isArray(id)) {
        return res.status(400).send("<h1>Bad request! Enter 'id' param!</h1>")
    }
    
    try {
        let data = req.cachedData;
        if (!data) {
            data = await fetchShikimoriAPI(`/characters/${id}`)
            cacheData(req.url, data)
        }
        
        res.status(200).json(data);
        
    } catch (err: any) {
        if (err.name === "TimeoutError") {
            res.status(503).send(`<h1>Shikimori Unavailable</h1>`)
        }
        res.status(400).send(`<h1>${err}</h1>`)
    }
}

export default withCache(handler)