import type { NextApiRequest, NextApiResponse } from 'next'
import withCache from "@/middleware/withCache";
import { cacheData, NextApiRequestWithCache } from "@/utils/caching";
import { fetchShikimoriAPI } from "@/shikimori_cfg";

async function handler(req: NextApiRequestWithCache, res: NextApiResponse) {
    const { id } = req.query;
    if (!id || Array.isArray(id)) {
        return res.status(400).send("<h1>Bad request! Enter 'name' or 'id' param!</h1>")
    }
    
    try {
        let data = req.cachedData;
        if (!data) {
            data = await fetchShikimoriAPI(`https://shikimori.one/api/characters/${id}`)
            cacheData(req.url, data)
        }
        
        res.status(200).json(data);
        
    } catch (err) {
        res.status(400).send(`<h1>${err}</h1>`)
    }
}

export default withCache(handler)